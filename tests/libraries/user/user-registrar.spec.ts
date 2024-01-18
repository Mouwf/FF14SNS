import { describe, test, expect, beforeEach } from "@jest/globals";
import MockUserRepository from "../../repositories/user/mock-user-repository";
import UserRegistrar from "../../../app/libraries/user/user-registrar";

/**
 * ユーザーの登録を行うクラス。
 */
let userAccountManager: UserRegistrar;

/**
 * 認証プロバイダID。
 */
const authenticationProvidedId = "authenticationProvidedId";

/**
 * ユーザー名。
 */
const userName = "UserName@World";

/**
 * ユーザーID。
 */
const id = 1;

beforeEach(() => {
    const mockUserRepository = new MockUserRepository();
    userAccountManager = new UserRegistrar(mockUserRepository);
});

describe("register", () => {
    test("register should register a user and return true.", async () => {
        // ユーザーを登録する。
        const response = await userAccountManager.register(authenticationProvidedId, userName);

        // 結果を検証する。
        expect(response).toBe(true);
    });

    test("register should throw an error when authentication provider id is empty.", async () => {
        expect.assertions(1);
        try {
            // ユーザーを登録する。
            const invalidAuthenticationProvidedId = "";
            await userAccountManager.register(invalidAuthenticationProvidedId, userName)
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe("認証プロバイダIDは必須です。");
        }
    });

    test("register should throw an error when user name is correct format.", async () => {
        expect.assertions(1);
        try {
            // ユーザーを登録する。
            const invalidUserName = "invalidUserName";
            await userAccountManager.register(authenticationProvidedId, invalidUserName)
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe("ユーザー名は「username@world」で入力してください。");
        }
    });
});

describe("delete", () => {
    test("delete should delete a user and return true.", async () => {
        // ユーザーを削除する。
        const response = await userAccountManager.delete(id);

        // 結果を検証する。
        expect(response).toBe(true);
    });

    test("delete should return false when id is not exist.", async () => {
        // ユーザーを削除する。
        const response = await userAccountManager.delete(2);

        // 結果を検証する。
        expect(response).toBe(false);
    });
});