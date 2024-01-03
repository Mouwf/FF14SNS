import { describe, test, expect, beforeEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
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
        // テスト用のユーザーをログインする。
        const responseSignIn = await delayAsync(() => firebaseClient.signInWithEmailPassword(mailAddress, password));

        // テスト用のユーザーを削除する。
        const idToken = responseSignIn.idToken;
        await delayAsync(() => firebaseClient.deleteUser(idToken));
        console.log("テスト用のユーザーを削除しました。");
    } catch (error) {
        console.log("テスト用のユーザーは存在しませんでした。");
    }
});

describe("getUser", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_FIREBASE_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("getUser should return a FF14SnsUser.", async () => {
        // テスト用のユーザーを登録する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // テスト用のユーザー情報を取得する。
        const idToken = responseSignUp.idToken;
        const responseUser = await delayAsync(() => firebaseAuthenticatedUserProvider.getUser(idToken));

        // 結果を検証する。
        const expectedUser = {
            name: mailAddress,
        };
        expect(responseUser).toEqual(expectedUser);
    });
});