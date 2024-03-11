import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
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
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("validateRegistrationUser", () => {
    test("validateRegistrationUser should validate registration user.", () => {
        // ユーザー登録のバリデーションを行う。
        const response = userRegistrationAction.validateRegistrationUser(mailAddress, password, password);

        // 結果を検証する。
        expect(response).toBeNull();
    });
});

describe("register", () => {
    test("register should register a user and return a SignUpResponse.", async () => {
        // テスト用のユーザーを登録する。
        const response = await delayAsync(() => userRegistrationAction.register(mailAddress, password, password));

        // 結果を検証する。
        expect(response.idToken).toBeDefined();
        expect(response.email).toBe(mailAddress);
        expect(response.refreshToken).toBeDefined();
        expect(response.expiresIn).toBeDefined();
        expect(response.localId).toBeDefined();
    });
});

describe("delete", () => {
    test("delete should delete a user and return true.", async () => {
        // テスト用のユーザーを登録する。
        const responseRegister = await delayAsync(() => userRegistrationAction.register(mailAddress, password, password));

        // ユーザー削除し、結果を検証する。
        const idToken = responseRegister.idToken;
        await expect(userRegistrationAction.delete(idToken)).resolves.toBeUndefined();
    });
});