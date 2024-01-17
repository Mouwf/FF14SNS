import { describe, test, expect, beforeEach } from "@jest/globals";
import MockUserRepository from "../../repositories/user/mock-user-repository";
import UserRegistrar from "../../../app/libraries/user/user-registrar";
import SnsUserRegistrationAction from "../../../app/actions/user/sns-user-registration-action";

/**
 * SNSのユーザー登録を行うアクション。
 */
let userRegistrationAction: SnsUserRegistrationAction;

beforeEach(() => {
    const mockUserRepository = new MockUserRepository();
    const userAccountManager = new UserRegistrar(mockUserRepository);
    userRegistrationAction = new SnsUserRegistrationAction(userAccountManager);
});

describe("register", () => {
    test("register should register a user and return true.", async () => {
        // ユーザーを登録する。
        const authenticationProvidedId = "authenticationProvidedId";
        const userName = "userName";
        const response = await userRegistrationAction.register(authenticationProvidedId, userName);

        // 結果を検証する。
        expect(response).toBe(true);
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