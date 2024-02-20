import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import UserAccountManager from "../../../../app/libraries/authentication/user-account-manager";
import FirebaseClient from "../../../../app/libraries/authentication/firebase-client";

/**
 * Firebaseのクライアント。
 */
let firebaseClient: FirebaseClient;

/**
 * ユーザー管理を行うクラス。
 */
let userAccountManager: UserAccountManager;

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
    userAccountManager = new UserAccountManager(firebaseClient);
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("validateRegistrationUser", () => {
    test("validateRegistrationUser should validate registration user.", () => {
        // ユーザー登録のバリデーションを行う。
        const response = userAccountManager.validateRegistrationUser(mailAddress, password, password);

        // 結果を検証する。
        expect(response).toBeNull();
    });
});

describe("register", () => {
    test("register should register a user.", async () => {
        // テスト用のユーザーを登録する。
        const response = await delayAsync(() => userAccountManager.register(mailAddress, password, password));

        // 結果を検証する。
        expect(response).toBeDefined();
    });
});

describe("delete", () => {
    test("delete should delete a user.", async () => {
        // テスト用のユーザーを登録する。
        const responseRegister = await delayAsync(() => userAccountManager.register(mailAddress, password, password));

        // ユーザーを削除し、結果を検証する。
        const idToken = responseRegister.idToken;
        await expect(userAccountManager.delete(idToken)).resolves.toBeUndefined();
    });
});

describe("validateLogin", () => {
    test("validateLogin should validate login.", () => {
        // ログインのバリデーションを行う。
        const response = userAccountManager.validateLogin(mailAddress, password);

        // 結果を検証する。
        expect(response).toBeNull();
    });
});

describe("login", () => {
    test("login should login a user.", async () => {
        // テスト用のユーザーを登録する。
        await delayAsync(() => userAccountManager.register(mailAddress, password, password));

        // テスト用のユーザーをログインする。
        const response = await delayAsync(() => userAccountManager.login(mailAddress, password));

        // 結果を検証する。
        expect(response).toBeTruthy();
    });
});

describe("logout", () => {
    test("logout should logout a user.", async () => {
        // テスト用のユーザーを登録する。
        const responseRegister = await delayAsync(() => userAccountManager.register(mailAddress, password, password));

        // ログアウトし、結果を検証する。
        const idToken = responseRegister.idToken;
        await expect(userAccountManager.logout(idToken)).resolves.toBeUndefined();
    });
});