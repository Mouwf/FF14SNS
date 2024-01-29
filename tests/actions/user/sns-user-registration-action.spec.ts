import { describe, test, expect, beforeEach } from "@jest/globals";
import MockUserRepository from "../../repositories/user/mock-user-repository";
import UserRegistrar from "../../../app/libraries/user/user-registrar";
import SnsUserRegistrationAction from "../../../app/actions/user/sns-user-registration-action";

/**
 * SNSのユーザー登録を行うアクション。
 */
let snsUserRegistrationAction: SnsUserRegistrationAction;

/**
 * 認証プロバイダID。
 */
const authenticationProviderId = "authenticationProviderId";

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
    const userAccountManager = new UserRegistrar(mockUserRepository);
    snsUserRegistrationAction = new SnsUserRegistrationAction(userAccountManager);
});

describe("register", () => {
    test("register should register a user and return true.", async () => {
        // ユーザーを登録する。
        const response = await snsUserRegistrationAction.register(authenticationProviderId, userName);

        // 結果を検証する。
        expect(response).toBe(true);
    });
});

describe("delete", () => {
    test("delete should delete a user and return true.", async () => {
        // ユーザーを削除する。
        const response = await snsUserRegistrationAction.delete(id);

        // 結果を検証する。
        expect(response).toBe(true);
    });
});