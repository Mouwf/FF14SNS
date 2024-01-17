import { describe, test, expect, beforeEach } from "@jest/globals";
import MockUserRepository from "../../repositories/user/mock-user-repository";
import UserRegistrar from "../../../app/libraries/user/user-registrar";

/**
 * ユーザーの登録を行うクラス。
 */
let userAccountManager: UserRegistrar;

beforeEach(() => {
    const mockUserRepository = new MockUserRepository();
    userAccountManager = new UserRegistrar(mockUserRepository);
});

describe("register", () => {
    test("register should register a user and return true.", async () => {
        // ユーザーを登録する。
        const authenticationProvidedId = "authenticationProvidedId";
        const userName = "userName";
        const response = await userAccountManager.register(authenticationProvidedId, userName);

        // 結果を検証する。
        expect(response).toBe(true);
    });
});

describe("delete", () => {
    test("delete should delete a user and return true.", async () => {
        // ユーザーを削除する。
        const token = "idToken";
        const response = await userAccountManager.delete(token);

        // 結果を検証する。
        expect(response).toBe(true);
    });
});