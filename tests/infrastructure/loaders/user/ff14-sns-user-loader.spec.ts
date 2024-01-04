import { describe, test, expect, beforeEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import FirebaseClient from "../../../../app/libraries/firebase/firebase-client";
import FirebaseAuthenticatedUserProvider from "../../../../app/libraries/user/firebase-authenticated-user-provider";
import FF14SnsUserLoader from "../../../../app/loaders/user/ff14-sns-user-loader";

/**
 * Firebaseのクライアント。
 */
let firebaseClient: FirebaseClient;

/**
 * Firebaseの認証済みユーザーを提供するクラス。
 */
let firebaseAuthenticatedUserProvider: FirebaseAuthenticatedUserProvider;

/**
 * FF14SNSのユーザーを取得するローダー。
 */
let ff14SnsUserLoader: FF14SnsUserLoader;

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
    firebaseAuthenticatedUserProvider = new FirebaseAuthenticatedUserProvider();
    ff14SnsUserLoader = new FF14SnsUserLoader(firebaseAuthenticatedUserProvider);

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

    test("getUser should return a FF14SnsUser.", async () => {
        // テスト用のユーザーを登録する。
        const responsSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // FF14SNSのユーザーを取得する。
        const idToken = responsSignUp.idToken;
        const response = await delayAsync(() => ff14SnsUserLoader.getUser(idToken));

        // 結果を検証する。
        expect(response.name).toBeDefined();
    });

    test("getUser should throw an error for an invalid token.", async () => {
        expect.assertions(1);
        try {
            // 無効なIDトークンでFF14SNSのユーザーを取得し、エラーを発生させる。
            const idToken = "invalidIdToken";
            await delayAsync(() => ff14SnsUserLoader.getUser(idToken));
        } catch (error) {
            // エラーを検証する。
            expect(error).toBeDefined();
        }
    });
});