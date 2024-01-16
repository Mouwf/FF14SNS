import { describe, test, expect, beforeEach } from "@jest/globals";
import MockAuthenticationClient from "../../libraries/authentication/mock-authentication-client";
import UserAccountManager from "../../../app/libraries/authentication/user-account-manager";
import UserAuthenticationAction from "../../../app/actions/authentication/user-authentication-action";

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

beforeEach(() => {
    const mockauthenticationClient = new MockAuthenticationClient();
    const userAccountManager: UserAccountManager = new UserAccountManager(mockauthenticationClient);
    userAuthenticationAction = new UserAuthenticationAction(userAccountManager);
});

describe("login", () => {
    test("login should login and return a SignInWithEmailPasswordResponse.", async () => {
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
});

describe("logout", () => {
    test("logout should logout and return true.", async () => {
        // ログアウトする。
        const idToken = "idToken";
        const response = await userAuthenticationAction.logout(idToken);

        // 結果を検証する。
        expect(response).toBe(true);
    });
});