import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import FirebaseClient from "../../../../app/libraries/authentication/firebase-client";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import { AppLoadContext } from "@remix-run/node";
import { loader, action } from "../../../../app/routes/app/route";
import { appLoadContext, postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import { commitSession, getSession } from "../../../../app/sessions";

/**
 * Firebaseのクライアント。
 */
let firebaseClient: FirebaseClient;

/**
 * Postgresのユーザーリポジトリ。
 */
let postgresUserRepository: PostgresUserRepository;

/**
 * テスト用のメールアドレス。
 */
const mailAddress = "test@example.com";

/**
 * テスト用のパスワード。
 */
const password = "testPassword123";

/**
 * プロフィールID。
 */
const profileId = "username_world";

/**
 * ユーザー名。
 */
const userName = "UserName@World";

/**
 * 現在のリリース情報ID。
 */
const currentReleaseInformationId = 1;

/**
 * コンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    firebaseClient = new FirebaseClient();
    postgresUserRepository = new PostgresUserRepository(postgresClientProvider);
    context = appLoadContext;
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("loader", () => {
    test("loader should return SNS user.", async () => {
        // テスト用のユーザーを作成する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = responseSignUp.localId;
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // ローダーを実行し、結果を取得する。
        const session = await getSession();
        session.set("idToken", responseSignUp.idToken);
        session.set("refreshToken", responseSignUp.refreshToken);
        session.set("userId", profileId);
        const requestWithCookie = new Request("https://example.com", {
            headers: {
                Cookie: await commitSession(session),
            },
        });
        const response = await loader({
            request: requestWithCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const resultUser = await response.json();

        // 結果を検証する。
        const expectedUser = {
            userId: profileId,
            userName: userName,
        };
        expect(resultUser.userId).toBe(expectedUser.userId);
        expect(resultUser.userName).toBe(expectedUser.userName);
        expect(resultUser.currentReleaseVersion).toBeDefined();
        expect(resultUser.currentReleaseName).toBeDefined();
    });
});

describe("action", () => {
    test("action shoula logout and delete cookies and redirect to login page.", async () => {
        // テスト用のユーザーを作成する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // アクションを実行し、結果を取得する。
        const session = await getSession();
        session.set("idToken", responseSignUp.idToken);
        session.set("refreshToken", responseSignUp.refreshToken);
        session.set("userId", profileId);
        const requestWithCookie = new Request("https://example.com", {
            headers: {
                Cookie: await commitSession(session),
            },
        });
        const response = await action({
            request: requestWithCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const status = response.status;
        const redirect = response.headers.get("Location");
        const resultSession = await getSession(response.headers.get("Set-Cookie"));

        // 結果を検証する。
        expect(status).toBe(302);
        expect(redirect).toBe("/auth/login");
        expect(resultSession.has("idToken")).toBe(false);
        expect(resultSession.has("refreshToken")).toBe(false);
        expect(resultSession.has("userId")).toBe(false);
    });

    // test("action should redirect to login page if an error occurs.", async () => {
    //     // TODO: ログアウトの処理を実装していないので後に実装する。
    //     expect.assertions(3);
    //     try {
    //         // アクションを実行し、エラーを発生させる。
    //         await action({
    //             request: requestWithInvalidCookie,
    //             params: {},
    //             context,
    //         });
    //     } catch (error) {
    //         // エラーがResponseでない場合、エラーを投げる。
    //         if (!(error instanceof Response)) {
    //             throw error;
    //         }

    //         // 検証に必要な情報を取得する。
    //         const status = error.status;
    //         const redirect = error.headers.get("Location");
    //         const cookie = await getSession(error.headers.get("Set-Cookie"));

    //         // 結果を検証する。
    //         expect(status).toBe(302);
    //         expect(redirect).toBe("/auth/login");
    //         expect(cookie).toStrictEqual({});
    //     }
    // });
});