import { describe, test, expect, beforeEach } from "@jest/globals";
import MockUserRepository from "../../../repositories/user/mock-user-repository";
import UserRegistrar from "../../../../app/libraries/user/user-registrar";
import SnsUserRegistrationAction from "../../../../app/actions/user/sns-user-registration-action";

/**
 * SNSのユーザー登録を行うアクション。
 */
let snsUserRegistrationAction: SnsUserRegistrationAction;

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
    const userAccountManager = new UserRegistrar(mockUserRepository);
    snsUserRegistrationAction = new SnsUserRegistrationAction(userAccountManager);
});

describe("register", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("register should register a user and return true.", async () => {
        // ユーザーを登録する。
        const response = await snsUserRegistrationAction.register(authenticationProvidedId, userName);

        // 結果を検証する。
        expect(response).toBe(true);
    });
});

describe("delete", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("delete should delete a user and return true.", async () => {
        // ユーザーを削除する。
        const response = await snsUserRegistrationAction.delete(id);

        // 結果を検証する。
        expect(response).toBe(true);
    });
});