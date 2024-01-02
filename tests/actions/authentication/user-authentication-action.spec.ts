import { describe, test, expect, beforeEach } from "@jest/globals";
import MockUserAuthenticator from "../../libraries/authentication/mock-user-authenticator";
import UserAuthenticationAction from "../../../app/actions/authentication/user-authentication-action";

/**
 * ユーザー認証を行うアクション。
 */
let userAuthenticationAction: UserAuthenticationAction;

const mailAddress = "test@example.com";
const password = "testPassword123";

beforeEach(() => {
    const mockuserAuthenticator = new MockUserAuthenticator();
    userAuthenticationAction = new UserAuthenticationAction(mockuserAuthenticator);
});

describe("login", () => {
    test("login should return a SignInWithEmailPasswordResponse object for valid parameters.", async () => {
        // ログインする。
        const response = await userAuthenticationAction.login(mailAddress, password);

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
            await userAuthenticationAction.login(invalidMailAddress, password);
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
            await userAuthenticationAction.login(mailAddress, invalidPassword);
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
    test("logout should return true for valid token.", async () => {
        // ログアウトする。
        const idToken = "idToken";
        const response = await userAuthenticationAction.logout(idToken);

        // 結果を検証する。
        expect(response).toBe(true);
    });

    test("logout should throw an exception for invalid token.", async () => {
        expect.assertions(1);
        try {
            // 無効なトークンでログアウトし、エラーを発生させる。
            const invalidToken = "invalid-token";
            await userAuthenticationAction.logout(invalidToken);
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