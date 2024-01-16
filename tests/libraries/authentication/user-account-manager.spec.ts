import { describe, test, expect, beforeEach } from "@jest/globals";
import MockAuthenticationClient from "./mock-authentication-client";
import UserAccountManager from "../../../app/libraries/authentication/user-account-manager";

/**
 * ユーザー認証を行うアクション。
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

beforeEach(() => {
    const mockAuthenticationClient = new MockAuthenticationClient();
    userAccountManager = new UserAccountManager(mockAuthenticationClient);
});

describe("register", () => {
    test("register should register a user and return a SignUpResponse.", async () => {
        // ユーザーを登録する。
        const response = await userAccountManager.register(mailAddress, password);

        // 結果を検証する。
        const expectedResponse = {
            idToken: "idToken",
            email: "test@example.com",
            refreshToken: "refreshToken",
            expiresIn: "3600",
            localId: "localId",
        };
        expect(response).toEqual(expectedResponse);
    });

    test("register should throw an exception for invalid email.", async () => {
        expect.assertions(1);
        try {
            // 無効なメールアドレスでユーザーを登録し、エラーを発生させる。
            const invalidMailAddress = "invalid-email";
            await userAccountManager.register(invalidMailAddress, password);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe("Invalid mail address.");
        }
    });

    test("register should throw an exception for invalid password.", async () => {
        expect.assertions(1);
        try {
            // 無効なパスワードでユーザーを登録し、エラーを発生させる。
            const invalidPassword = "invalid-password";
            await userAccountManager.register(mailAddress, invalidPassword);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe("Invalid password.");
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
            localId: "localId",
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
            expect(error.message).toBe("Invalid mail address.");
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
            expect(error.message).toBe("Invalid password.");
        }
    });
});

describe("logout", () => {
    test("logout should logout and return true.", async () => {
        // ログアウトする。
        const idToken = "idToken";
        const response = await userAccountManager.logout(idToken);

        // 結果を検証する。
        expect(response).toBe(true);
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

describe("delete", () => {
    test("delete should delete a user and return true.", async () => {
        // ユーザーを削除する。
        const token = "idToken";
        const response = await userAccountManager.delete(token);

        // 結果を検証する。
        expect(response).toBe(true);
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
            expect(error.message).toBe("Invalid token.");
        }
    });
});