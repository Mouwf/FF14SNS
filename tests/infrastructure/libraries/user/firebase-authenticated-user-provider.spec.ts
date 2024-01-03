import { describe, test, expect, beforeEach } from "@jest/globals";
import FirebaseAuthenticatedUserProvider from "../../../../app/libraries/user/firebase-authenticated-user-provider";
import FirebaseClient from "../../../../app/libraries/firebase/firebase-client";

/**
 * Firebaseのクライアント。
 */
let firebaseClient: FirebaseClient;

/**
 * Firebaseを利用した認証済みユーザーを提供するクラス。
 */
let firebaseAuthenticatedUserProvider: FirebaseAuthenticatedUserProvider;

/**
 * テスト用のメールアドレス。
 */
const mailAddress = "test@example.com";

/**
 * テスト用のパスワード。
 */
const password = "testPassword123";

beforeEach(async () => {
    firebaseClient = new FirebaseClient();
    firebaseAuthenticatedUserProvider = new FirebaseAuthenticatedUserProvider();

    // テスト用のユーザーが存在する場合、削除する。
    try {
        const response = await firebaseClient.signInWithEmailPassword(mailAddress, password);
        firebaseClient.deleteUser(response.idToken);
        console.log("テスト用のユーザーを削除しました。");
    } catch (error) {
        console.log("テスト用のユーザーは存在しませんでした。");
    }
});

describe("getUser", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("getUser should return a FF14SnsUser.", async () => {
        // ユーザーを登録する。
        const responseSignUp = await firebaseClient.signUp(mailAddress, password);

        // ユーザー情報を取得する。
        const idToken = responseSignUp.idToken;
        const responseUser = await firebaseAuthenticatedUserProvider.getUser(idToken);

        // 結果を検証する。
        const expectedUser = {
            name: mailAddress,
        };
        expect(responseUser).toEqual(expectedUser);
    });
});