import { describe, test, expect, beforeEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import FirebaseClient from "../../../../app/libraries/authentication/firebase-client";
import UserAccountManager from "../../../../app/libraries/authentication/user-account-manager";
import UserAuthenticationAction from "../../../../app/actions/authentication/user-authentication-action";

/**
 * Firebaseのクライアント。
 */
let firebaseClient: FirebaseClient;

/**
 * ユーザー管理を行うクラス。
 */
let userAccountManager: UserAccountManager;

/**
 * ユーザー認証を行うアクション。
 */
let userAuthenticationAction: UserAuthenticationAction;

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
    userAccountManager = new UserAccountManager(firebaseClient);
    userAuthenticationAction = new UserAuthenticationAction(userAccountManager);

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

describe("login", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("login should login and return a SignInWithEmailPasswordResponse.", async () => {
        // テスト用のユーザーを登録する。
        await delayAsync(() => userAccountManager.register(mailAddress, password));

        // テスト用のユーザーログインする。
        const response = await delayAsync(() => userAuthenticationAction.login(mailAddress, password));

        // 結果を検証する。
        expect(response.idToken).toBeDefined();
        expect(response.email).toBe(mailAddress);
        expect(response.refreshToken).toBeDefined();
        expect(response.expiresIn).toBeDefined();
        expect(response.localId).toBeDefined();
        expect(response.registered).toBeDefined();
    });

    test("login should throw an exception for invalid email.", async () => {
        expect.assertions(1);
        try {
            // テスト用のユーザーを登録する。
            await delayAsync(() => userAccountManager.register(mailAddress, password));

            // 無効なメールアドレスでログインし、エラーを発生させる。
            const invalidMailAddress = "invalid-email";
            await delayAsync(() => userAuthenticationAction.login(invalidMailAddress, password));
        } catch (error) {
            // エラーを検証する。
            expect(error).toBeDefined();
        }
    });

    test("login should throw an exception for invalid password.", async () => {
        expect.assertions(1);
        try {
            // テスト用のユーザーを登録する。
            await delayAsync(() => userAccountManager.register(mailAddress, password));

            // 無効なパスワードでログインし、エラーを発生させる。
            const invalidPassword = "invalid-password";
            await delayAsync(() => userAuthenticationAction.login(mailAddress, invalidPassword));
        } catch (error) {
            // エラーを検証する。
            expect(error).toBeDefined();
        }
    });
});

describe("logout", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("logout should logout and return true.", async () => {
        // テスト用のユーザーを登録する。
        const responseRegister = await delayAsync(() => userAccountManager.register(mailAddress, password));

        // テスト用ユーザーをログアウトする。
        const idToken = responseRegister.idToken;
        const response = await delayAsync(() => userAuthenticationAction.logout(idToken));

        // 結果を検証する。
        expect(response).toBe(true);
    });
});