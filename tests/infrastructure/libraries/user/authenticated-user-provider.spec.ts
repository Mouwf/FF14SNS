import { describe, test, expect, beforeEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import AuthenticatedUserProvider from "../../../../app/libraries/user/authenticated-user-provider";
import FirebaseClient from "../../../../app/libraries/authentication/firebase-client";

/**
 * Firebaseのクライアント。
 */
let firebaseClient: FirebaseClient;

/**
 * 認証済みユーザーを提供するクラス。
 */
let authenticatedUserProvider: AuthenticatedUserProvider;

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
    authenticatedUserProvider = new AuthenticatedUserProvider(firebaseClient);

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
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // テスト用のユーザー情報を取得する。
        const idToken = responseSignUp.idToken;
        const responseUser = await delayAsync(() => authenticatedUserProvider.getUser(idToken));

        // 結果を検証する。
        const expectedUser = {
            userName: mailAddress,
        };
        expect(responseUser.id).toBeDefined();
        expect(responseUser.userName).toBe(expectedUser.userName);
        expect(new Date(responseUser.createdAt)).toBeInstanceOf(Date);
    });
});