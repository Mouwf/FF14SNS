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

/**
 * 再確認パスワード。
 */
const confirmPassword = "testPassword123";

beforeEach(() => {
    const mockauthenticationClient = new MockAuthenticationClient();
    const userAccountManager: UserAccountManager = new UserAccountManager(mockauthenticationClient);
    userRegistrationAction = new UserRegistrationAction(userAccountManager);
});

describe("register", () => {
    test("register should register a user and return a SignUpResponse.", async () => {
        // ユーザーを登録する。
        const response = await userRegistrationAction.register(mailAddress, password, confirmPassword);

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
        // ユーザー削除し、結果を検証する。
        const token = "idToken";
        await expect(userRegistrationAction.delete(token)).resolves.toBeUndefined();
    });
});