import { describe, test, expect, beforeEach } from "@jest/globals";
import MockAuthenticationClient from "./mock-authentication-client";
import UserAccountManager from "../../../app/libraries/authentication/user-account-manager";
import systemMessages from "../../../app/messages/system-messages";

/**
 * ユーザー管理を行うクラス。
 */
let userAccountManager: UserAccountManager;

/**
 * メールアドレス。
 */
const mailAddress = "test@example.com";

/**
 * パスワード。
 */
const password = "testPassword123";

/**
 * 再確認パスワード。
 */
const confirmPassword = "testPassword123";

beforeEach(() => {
    const mockAuthenticationClient = new MockAuthenticationClient();
    userAccountManager = new UserAccountManager(mockAuthenticationClient);
});

describe("validateRegistrationUser", () => {
    test("validateRegistrationUser should validate registration user.", () => {
        // ユーザー登録のバリデーションを行う。
        const response = userAccountManager.validateRegistrationUser(mailAddress, password, confirmPassword);

        // 結果を検証する。
        expect(response).toBeNull();
    });

    test("validateRegistrationUser should return error message for invalid email.", () => {
        // 無効なメールアドレスでユーザー登録のバリデーションを行う。
        const invalidMailAddress = "invalid-email";
        const response = userAccountManager.validateRegistrationUser(invalidMailAddress, password, confirmPassword);

        // 結果を検証する。
        const expectedResponse = {
            mailAddress: [
                systemMessages.error.invalidMailAddress,
            ],
            password: [],
        };
        expect(response).toEqual(expectedResponse);
    });

    test("validateRegistrationUser should return error message for invalid password.", () => {
        // 無効なパスワードでユーザー登録のバリデーションを行う。
        const invalidPassword = "test";
        const response = userAccountManager.validateRegistrationUser(mailAddress, invalidPassword, invalidPassword);

        // 結果を検証する。
        const expectedResponse = {
            mailAddress: [],
            password: [
                systemMessages.error.invalidPasswordOnSetting,
            ],
        };
        expect(response).toEqual(expectedResponse);
    });

    test("validateRegistrationUser should return error message for password mismatch.", () => {
        // パスワードと再確認パスワードが一致しない場合、ユーザー登録のバリデーションを行う。
        const invalidConfirmPassword = "invalid-confirm-password";
        const response = userAccountManager.validateRegistrationUser(mailAddress, password, invalidConfirmPassword);

        // 結果を検証する。
        const expectedResponse = {
            mailAddress: [],
            password: [
                systemMessages.error.passwordMismatch,
            ],
        };
        expect(response).toEqual(expectedResponse);
    });
});

describe("register", () => {
    test("register should register a user and return a SignUpResponse.", async () => {
        // ユーザーを登録する。
        const response = await userAccountManager.register(mailAddress, password, confirmPassword);

        // 結果を検証する。
        const expectedResponse = {
            idToken: "idToken",
            email: "test@example.com",
            refreshToken: "refreshToken",
            expiresIn: "3600",
            localId: "authenticationProviderId",
        };
        expect(response).toEqual(expectedResponse);
    });
});

describe("delete", () => {
    test("delete should delete a user.", async () => {
        // ユーザーを削除し、結果を検証する。
        const token = "idToken";
        await expect(userAccountManager.delete(token)).resolves.toBeUndefined();
    });

    test("delete should throw an exception for invalid token.", async () => {
        expect.assertions(1);
        try {
            // 無効なトークンでユーザーを削除し、エラーを発生させる。
            const token = "invalid-token";
            await userAccountManager.delete(token);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe(systemMessages.error.authenticationUserDeletionFailed);
        }
    });
});

describe("validateLogin", () => {
    test("validateLogin should validate login.", () => {
        // ログインのバリデーションを行う。
        const response = userAccountManager.validateLogin(mailAddress, password);

        // 結果を検証する。
        expect(response).toBeNull();
    });

    test("validateLogin should return error message for invalid email.", () => {
        // 無効なメールアドレスでログインのバリデーションを行う。
        const invalidMailAddress = "invalid-email";
        const response = userAccountManager.validateLogin(invalidMailAddress, password);

        // 結果を検証する。
        const expectedResponse = {
            mailAddress: [
                systemMessages.error.invalidMailAddress,
            ],
            password: [],
        };
        expect(response).toEqual(expectedResponse);
    });

    test("validateLogin should return error message for invalid password.", () => {
        // 無効なパスワードでログインのバリデーションを行う。
        const invalidPassword = "invalid-password";
        const response = userAccountManager.validateLogin(mailAddress, invalidPassword);

        // 結果を検証する。
        const expectedResponse = {
            mailAddress: [],
            password: [
                systemMessages.error.invalidPasswordOnSetting,
            ],
        };
        expect(response).toEqual(expectedResponse);
    });
});

describe("login", () => {
    test("login should login and return a SignInWithEmailPasswordResponse.", async () => {
        // ログインする。
        const response = await userAccountManager.login(mailAddress, password);

        // 結果を検証する。
        const expectedResponse = {
            displayName: "DisplayName",
            idToken: "idToken",
            email: mailAddress,
            refreshToken: "refreshToken",
            expiresIn: "3600",
            localId: "authenticationProviderId",
            registered: true,
        }
        expect(response).toEqual(expectedResponse);
    });
});

describe("logout", () => {
    test("logout should logout.", async () => {
        // ログアウトし、結果を検証する。
        const idToken = "idToken";
        await expect(userAccountManager.logout(idToken)).resolves.toBeUndefined();
    });

    // TODO: リフレッシュトークンを無効にしてログアウトする処理を追加した後にコメントアウトを外す。
    // test("logout should throw an exception for invalid token.", async () => {
    //     expect.assertions(1);
    //     try {
    //         // 無効なトークンでログアウトし、エラーを発生させる。
    //         const invalidToken = "invalid-token";
    //         await userAccountManager.logout(invalidToken);
    //     } catch (error) {
    //         // エラーがErrorでない場合、エラーを投げる。
    //         if (!(error instanceof Error)) {
    //             throw error;
    //         }

    //         // エラーを検証する。
    //         expect(error.message).toBe("Invalid token.");
    //     }
    // });
});