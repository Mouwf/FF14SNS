import { describe, test, expect, beforeEach } from "@jest/globals";
import MockUserRepository from "../../repositories/user/mock-user-repository";
import UserProfileManager from "../../../app/libraries/user/user-profile-manager";
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

/**
 * 現在のリリース情報ID。
 */
const currentReleaseInformationId = 1;

beforeEach(() => {
    const mockUserRepository = new MockUserRepository();
    const userProfileManager = new UserProfileManager(mockUserRepository);
    snsUserRegistrationAction = new SnsUserRegistrationAction(userProfileManager);
});

describe("register", () => {
    test("register should register a user.", async () => {
        // ユーザーを登録し、結果を検証する。
        await expect(snsUserRegistrationAction.register(authenticationProviderId, userName, currentReleaseInformationId)).resolves.toBeUndefined();
    });
});

describe("delete", () => {
    test("delete should delete a user.", async () => {
        // ユーザーを削除し、結果を検証する。
        await expect(snsUserRegistrationAction.delete(id)).resolves.toBeUndefined();
    });
});