import { describe, test, expect, beforeEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import FirebaseClient from "../../../../app/libraries/authentication/firebase-client";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import { AppLoadContext } from "@netlify/remix-runtime";
import { loader, action } from "../../../../app/routes/app/route";
import { appLoadContext, postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import { userAuthenticationCookie } from "../../../../app/cookies.server";

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
 * コンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    firebaseClient = new FirebaseClient();
    postgresUserRepository = new PostgresUserRepository(postgresClientProvider);

    // テスト用のユーザーが存在する場合、削除する。
    try {
        // テスト用のユーザーをログインする。
        const responseSignIn = await delayAsync(() => firebaseClient.signInWithEmailPassword(mailAddress, password));

        // テスト用のユーザーを削除する。
        const idToken = responseSignIn.idToken;
        await delayAsync(() => firebaseClient.deleteUser(idToken));
        console.info("テスト用のユーザーを削除しました。");
    } catch (error) {
        console.info("テスト用のユーザーは存在しませんでした。");
    }

    // テスト用のユーザー情報が存在する場合、削除する。
    try {
        // テスト用のユーザー情報を取得する。
        const responseFindByProfileId = await delayAsync(() => postgresUserRepository.findByProfileId(profileId));

        // テスト用のユーザー情報が存在しない場合、エラーを投げる。
        if (responseFindByProfileId == null) throw new Error("The user does not exist.");

        const id = responseFindByProfileId.id;
        await delayAsync(() => postgresUserRepository.delete(id));
        console.info("テスト用のユーザー情報を削除しました。");
    } catch (error) {
        console.info("テスト用のユーザー情報は存在しませんでした。");
    }

    // コンテキストを設定する。
    context = appLoadContext;
});

describe("loader", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("loader should return SNS user.", async () => {
        // テスト用のユーザーを作成する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = responseSignUp.localId;
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName));

        // ローダーを実行し、結果を取得する。
        const requestWithCookie = new Request("https://example.com", {
            headers: {
                Cookie: await userAuthenticationCookie.serialize({
                    idToken: responseSignUp.idToken,
                    refreshToken: responseSignUp.refreshToken,
                }),
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
    });

    test("loader should redirect register user page if user is not loged in.", async () => {
        // テスト用のユーザーを作成する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // ローダーを実行し、結果を取得する。
        const requestWithCookie = new Request("https://example.com", {
            headers: {
                Cookie: await userAuthenticationCookie.serialize({
                    idToken: responseSignUp.idToken,
                    refreshToken: responseSignUp.refreshToken,
                }),
            },
        });
        const response = await loader({
            request: requestWithCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const status = response.status;
        const redirect = response.headers.get("Location");

        // 結果を検証する。
        expect(status).toBe(302);
        expect(redirect).toBe("/auth/register-user");
    });
});

describe("action", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("action shoula logout and delete cookies.", async () => {
        // テスト用のユーザーを作成する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));
        const requestWithCookie = new Request("https://example.com", {
            headers: {
                Cookie: await userAuthenticationCookie.serialize({
                    idToken: responseSignUp.idToken,
                    refreshToken: responseSignUp.refreshToken,
                }),
            },
        });

        // アクションを実行し、結果を取得する。
        const response = await action({
            request: requestWithCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const status = response.status;
        const redirect = response.headers.get("Location");
        const cookie = await userAuthenticationCookie.parse(response.headers.get("Set-Cookie"));

        // 結果を検証する。
        expect(status).toBe(302);
        expect(redirect).toBe("/auth/login");
        expect(cookie).toStrictEqual({});
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
    //         const cookie = await userAuthenticationCookie.parse(error.headers.get("Set-Cookie"));

    //         // 結果を検証する。
    //         expect(status).toBe(302);
    //         expect(redirect).toBe("/auth/login");
    //         expect(cookie).toStrictEqual({});
    //     }
    // });
});