import { describe, test, expect, beforeEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import FirebaseClient from "../../../../app/libraries/authentication/firebase-client";
import UserAccountManager from "../../../../app/libraries/authentication/user-account-manager";
import UserRegistrationAction from "../../../../app/actions/authentication/user-registration-action";

/**
 * Firebaseのクライアント。
 */
let firebaseClient: FirebaseClient;

/**
 * ユーザー管理を行うクラス。
 */
let userAccountManager: UserAccountManager;

/**
 * ユーザー登録を行うアクション。
 */
let userRegistrationAction: UserRegistrationAction;

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
    userRegistrationAction = new UserRegistrationAction(userAccountManager);

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

describe("register", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("register should register a user and return a SignUpResponse.", async () => {
        // テスト用のユーザーを登録する。
        const response = await delayAsync(() => userRegistrationAction.register(mailAddress, password));

        // 結果を検証する。
        expect(response.idToken).toBeDefined();
        expect(response.email).toBe(mailAddress);
        expect(response.refreshToken).toBeDefined();
        expect(response.expiresIn).toBeDefined();
        expect(response.localId).toBeDefined();
    });

    test("register should throw an exception for invalid email.", async () => {
        expect.assertions(1);
        try {
            // 無効なメールアドレスでユーザーを登録し、エラーを発生させる。
            const invalidMailAddress = "invalid-email";
            await delayAsync(() => userRegistrationAction.register(invalidMailAddress, password));
        } catch (error) {
            // エラーを検証する。
            expect(error).toBeDefined();
        }
    });

    test("register should throw an exception for invalid password.", async () => {
        expect.assertions(1);
        try {
            // 無効なパスワードでユーザーを登録し、エラーを発生させる。
            const invalidPassword = "invalid-password";
            await delayAsync(() => userRegistrationAction.register(mailAddress, invalidPassword));
        } catch (error) {
            // エラーを検証する。
            expect(error).toBeDefined();
        }
    });
});

describe("delete", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("delete should delete a user and return true.", async () => {
        // テスト用のユーザーを登録する。
        const responseRegister = await delayAsync(() => userRegistrationAction.register(mailAddress, password));

        // テスト用のユーザーを削除する。
        const idToken = responseRegister.idToken;
        const response = await delayAsync(() => userRegistrationAction.delete(idToken));

        // 結果を検証する。
        expect(response).toBe(true);
    });
});