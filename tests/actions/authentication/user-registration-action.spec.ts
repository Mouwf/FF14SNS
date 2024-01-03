import { describe, test, expect, beforeEach } from "@jest/globals";
import UserRegistrationAction from "../../../app/actions/authentication/user-registration-action";
import MockUserRegistrar from "../../libraries/authentication/mock-user-registrar";

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
    const mockUserRegistrar = new MockUserRegistrar();
    userRegistrationAction = new UserRegistrationAction(mockUserRegistrar);
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

    test("register should throw an exception for invalid email.", async () => {
        expect.assertions(1);
        try {
            // 無効なメールアドレスでユーザーを登録し、エラーを発生させる。
            const invalidMailAddress = "invalid-email";
            await userRegistrationAction.register(invalidMailAddress, password);
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
            await userRegistrationAction.register(mailAddress, invalidPassword);
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

describe("delete", () => {
    test("delete should delete a user and return true.", async () => {
        // ユーザーを削除する。
        const token = "idToken";
        const response = await userRegistrationAction.delete(token);

        // 結果を検証する。
        expect(response).toBe(true);
    });

    test("delete should throw an exception for invalid token.", async () => {
        expect.assertions(1);
        try {
            // 無効なメールアドレスでユーザーを削除し、エラーを発生させる。
            const token = "invalid-token";
            await userRegistrationAction.delete(token);
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