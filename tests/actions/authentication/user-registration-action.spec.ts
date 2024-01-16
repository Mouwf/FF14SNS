import { describe, test, expect, beforeEach } from "@jest/globals";
import UserRegistrationAction from "../../../app/actions/authentication/user-registration-action";
import MockAuthenticationClient from "../../libraries/authentication/mock-authentication-client";
import UserAccountManager from "../../../app/libraries/authentication/user-account-manager";

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

beforeEach(() => {
    const mockauthenticationClient = new MockAuthenticationClient();
    const userAccountManager: UserAccountManager = new UserAccountManager(mockauthenticationClient);
    userRegistrationAction = new UserRegistrationAction(userAccountManager);
});

describe("register", () => {
    test("register should register a user and return a SignUpResponse.", async () => {
        // ユーザーを登録する。
        const response = await userRegistrationAction.register(mailAddress, password);

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
});

describe("delete", () => {
    test("delete should delete a user and return true.", async () => {
        // ユーザーを削除する。
        const token = "idToken";
        const response = await userRegistrationAction.delete(token);

        // 結果を検証する。
        expect(response).toBe(true);
    });
});