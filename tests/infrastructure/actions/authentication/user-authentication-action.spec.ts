import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
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
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("validateLogin", () => {
    test("validateLogin should validate login.", () => {
        // ログインのバリデーションを行う。
        const response = userAuthenticationAction.validateLogin(mailAddress, password);

        // 結果を検証する。
        expect(response).toBeNull();
    });
});

describe("login", () => {
    test("login should login and return a SignInWithEmailPasswordResponse.", async () => {
        // テスト用のユーザーを登録する。
        await delayAsync(() => userAccountManager.register(mailAddress, password, password));

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
});

describe("logout", () => {
    test("logout should logout and return true.", async () => {
        // テスト用のユーザーを登録する。
        const responseRegister = await delayAsync(() => userAccountManager.register(mailAddress, password, password));

        // ログアウトし、結果を検証する。
        const idToken = responseRegister.idToken;
        await expect(userAuthenticationAction.logout(idToken)).resolves.toBeUndefined();
    });
});