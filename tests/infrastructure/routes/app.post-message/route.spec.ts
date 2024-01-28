import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import FirebaseClient from "../../../../app/libraries/authentication/firebase-client";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import { AppLoadContext } from "@netlify/remix-runtime";
import { appLoadContext, postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import { loader, action } from "../../../../app/routes/app.post-message/route";
import { userAuthenticationCookie, newlyPostedPostCookie } from "../../../../app/cookies.server";

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
 * モックリクエスト。
 */
let request: Request;

/**
 * モックコンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    firebaseClient = new FirebaseClient();
    postgresUserRepository = new PostgresUserRepository(postgresClientProvider);
    request = new Request("https://example.com");
    context = appLoadContext;
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("loader", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("loader should return release information.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: request,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const resultAllReleaseInformation = await response.json();

        // 結果を検証する。
        resultAllReleaseInformation.map((releaseInformation) => {
            expect(releaseInformation.id).toBeDefined();
            expect(releaseInformation.releaseVersion).toBeDefined();
            expect(releaseInformation.releaseName).toBeDefined();
            expect(new Date(releaseInformation.createdAt)).toBeInstanceOf(Date);
        });
    });
});

describe("action", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("action should redirect to app page and return posted postId in the cookies.", async () => {
        // テスト用のユーザーを登録する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = responseSignUp.localId;
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName));

        // アクションを実行し、結果を取得する。
        const idToken = responseSignUp.idToken;
        const requestWithBody = new Request("https://example.com", {
            headers: {
                Cookie: await userAuthenticationCookie.serialize({
                    idToken: idToken,
                }),
            },
            method: "POST",
            body: new URLSearchParams({
                releaseInformationId: "1",
                content: "アクション経由の投稿テスト！",
            }),
        });
        const response = await action({
            request: requestWithBody,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const status = response.status;
        const location = response.headers.get("Location");
        const cookie = await newlyPostedPostCookie.parse(response.headers.get("Set-Cookie"));

        // 結果を検証する。
        expect(status).toBe(302);
        expect(location).toBe("/app");
        expect(cookie.postId).toBeDefined();
    });

    test("action should return error message when id token is invalid.", async () => {
        // アクションを実行する。
        const requestWithBody = new Request("https://example.com", {
            headers: {
                Cookie: await userAuthenticationCookie.serialize({
                    idToken: "invalidIdToken",
                }),
            },
            method: "POST",
            body: new URLSearchParams({
                releaseInformationId: "1",
                content: "アクション経由の投稿テスト！",
            }),
        });
        const response = await action({
            request: requestWithBody,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const errorInformation = await response.json();

        // 結果を検証する。
        expect(errorInformation).toBeDefined();
    });
});