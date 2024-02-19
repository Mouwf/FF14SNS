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

    test("register should throw an exception for invalid email.", async () => {
        expect.assertions(1);
        try {
            // 無効なメールアドレスでユーザーを登録し、エラーを発生させる。
            const invalidMailAddress = "invalid-email";
            await userAccountManager.register(invalidMailAddress, password, confirmPassword);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe(systemMessages.error.signUpFailed);
        }
    });

    test("register should throw an exception for invalid password.", async () => {
        expect.assertions(1);
        try {
            // 無効なパスワードでユーザーを登録し、エラーを発生させる。
            const invalidPassword = "invalid-password";
            await userAccountManager.register(mailAddress, invalidPassword, confirmPassword);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe(systemMessages.error.signUpFailed);
        }
    });

    test("register should throw an exception for invalid confirm password.", async () => {
        expect.assertions(1);
        try {
            // 無効な再確認パスワードでユーザーを登録し、エラーを発生させる。
            const invalidConfirmPassword = "invalid-confirm-password";
            await userAccountManager.register(mailAddress, password, invalidConfirmPassword);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe(systemMessages.error.signUpFailed);
        }
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

    test("login should throw an exception for invalid email.", async () => {
        expect.assertions(1);
        try {
            // 無効なメールアドレスでログインし、エラーを発生させる。
            const invalidMailAddress = "invalid-email";
            await userAccountManager.login(invalidMailAddress, password);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe(systemMessages.error.invalidMailAddressOrPassword);
        }
    });

    test("login should throw an exception for invalid password.", async () => {
        expect.assertions(1);
        try {
            // 無効なパスワードでログインし、エラーを発生させる。
            const invalidPassword = "invalid-password";
            await userAccountManager.login(mailAddress, invalidPassword);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe(systemMessages.error.invalidMailAddressOrPassword);
        }
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