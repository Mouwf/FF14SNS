import { describe, test, expect, beforeEach } from "@jest/globals";
import MockUserRepository from "../../repositories/user/mock-user-repository";
import UserProfileManager from "../../../app/libraries/user/user-profile-manager";

/**
 * ユーザーの登録を行うクラス。
 */
let userAccountManager: UserProfileManager;

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
    userAccountManager = new UserProfileManager(mockUserRepository);
});

describe("register", () => {
    test("register should register a user and return true.", async () => {
        // ユーザーを登録する。
        const response = await userAccountManager.register(authenticationProviderId, userName, currentReleaseInformationId);

        // 結果を検証する。
        expect(response).toBe(true);
    });

    test("register should throw an error when authentication provider id is empty.", async () => {
        expect.assertions(1);
        try {
            // ユーザーを登録する。
            const invalidAuthenticationProviderId = "";
            await userAccountManager.register(invalidAuthenticationProviderId, userName, currentReleaseInformationId);
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
            await userAccountManager.register(authenticationProviderId, invalidUserName, currentReleaseInformationId);
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

describe("editUserSetting", () => {
    test("editUserSetting should edit a user setting and return true.", async () => {
        // ユーザー設定を更新する。
        const userSetting = {
            userId: "username_world1",
            userName: "UserName@World1",
            currentReleaseInformationId: 1,
        };
        const response = await userAccountManager.editUserSetting(userSetting);

        // 結果を検証する。
        expect(response).toBe(true);
    });

    test("editUserSetting should throw an error when user id is not exist.", async () => {
        expect.assertions(1);
        try {
            // ユーザー設定を更新する。
            const userSetting = {
                userId: "username_world2",
                userName: "UserName@World2",
            currentReleaseInformationId: 3,
            };
            await userAccountManager.editUserSetting(userSetting);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe("ユーザーが存在しません。");
        }
    });

    test("editUserSetting should return false when user id is invalid.", async () => {
        // ユーザー設定を更新する。
        const userSetting = {
            userId: "invalidUserId",
            userName: "InvalidUserName@World",
            currentReleaseInformationId: 1,
        };
        const response = await userAccountManager.editUserSetting(userSetting);

        // 結果を検証する。
        expect(response).toBe(false);
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

describe("fetchUserSettingByProfileId", () => {
    test("fetchUserSettingByProfileId should fetch a user setting.", async () => {
        // ユーザー設定を取得する。
        const profileId = "username_world1";
        const response = await userAccountManager.fetchUserSettingByProfileId(profileId);

        // 結果を検証する。
        expect(response.userId).toBe("username_world1");
        expect(response.userName).toBe("UserName@World1");
        expect(response.currentReleaseInformationId).toBe(1);
    });

    test("fetchUserSettingByProfileId should throw an error when profile id is not exist.", async () => {
        expect.assertions(1);
        try {
            // ユーザー設定を取得する。
            const invalidProfileId = "invalidProfileId";
            await userAccountManager.fetchUserSettingByProfileId(invalidProfileId);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe("ユーザー設定が存在しません。");
        }
    });
});