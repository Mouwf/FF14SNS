import { describe, test, expect, beforeEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import FirebaseClient from "../../../../app/libraries/authentication/firebase-client";
import AuthenticatedUserProvider from "../../../../app/libraries/user/authenticated-user-provider";
import AuthenticatedUserLoader from "../../../../app/loaders/user/authenticated-user-loader";

/**
 * Firebaseのクライアント。
 */
let firebaseClient: FirebaseClient;

/**
 * Firebaseの認証済みユーザーを提供するクラス。
 */
let authenticatedUserProvider: AuthenticatedUserProvider;

/**
 * 認証済みユーザーを取得するローダー。
 */
let authenticatedUserLoader: AuthenticatedUserLoader;

/**
 * メールアドレス。
 */
const mailAddress = "test@example.com";

/**
 * パスワード。
 */
const password = "testPassword123";

beforeEach(async () => {
    firebaseClient = new FirebaseClient();
    authenticatedUserProvider = new AuthenticatedUserProvider(firebaseClient);
    authenticatedUserLoader = new AuthenticatedUserLoader(authenticatedUserProvider);

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
});

describe("getUser", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("getUser should return a AuthenticatedUser.", async () => {
        // テスト用のユーザーを登録する。
        const responsSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // 認証済みユーザーを取得する。
        const idToken = responsSignUp.idToken;
        const response = await delayAsync(() => authenticatedUserLoader.getUser(idToken));

        // 結果を検証する。
        expect(response.id).toBeDefined();
        expect(response.userName).toBeDefined();
        expect(response.createdAt).toBeInstanceOf(Date);
    });

    test("getUser should throw an error for an invalid token.", async () => {
        expect.assertions(1);
        try {
            // 無効なIDトークンで認証済みユーザーを取得し、エラーを発生させる。
            const idToken = "invalidIdToken";
            await delayAsync(() => authenticatedUserLoader.getUser(idToken));
        } catch (error) {
            // エラーを検証する。
            expect(error).toBeDefined();
        }
    });
});