import { describe, test, expect, beforeEach } from "@jest/globals";
import MockUserRepository from "../../repositories/user/mock-user-repository";
import UserProfileManager from "../../../app/libraries/user/user-profile-manager";
import systemMessages from "../../../app/messages/system-messages";

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
    test("register should register a user.", async () => {
        // ユーザーを登録し、結果を検証する。
        await expect(userAccountManager.register(authenticationProviderId, userName, currentReleaseInformationId)).resolves.toBeUndefined();
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
            expect(error.message).toBe(systemMessages.error.userRegistrationFailed);
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
            expect(error.message).toBe(systemMessages.error.userRegistrationFailed);
        }
    });
});

describe("editUserSetting", () => {
    test("editUserSetting should edit a user.", async () => {
        // ユーザー設定を更新し、結果を検証する。
        const userSetting = {
            userId: "username_world1",
            userName: "UserName@World1",
            currentReleaseInformationId: 1,
        };
        await expect(userAccountManager.editUserSetting(userSetting)).resolves.toBeUndefined();
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
            expect(error.message).toBe(systemMessages.error.userSettingEditFailed);
        }
    });

    test("editUserSetting should throw an error when user id is invalid.", async () => {
        expect.assertions(1);
        try {
            // ユーザー設定を更新する。
            const userSetting = {
                userId: "invalidUserId",
                userName: "InvalidUserName@World",
                currentReleaseInformationId: 1,
            };
            await userAccountManager.editUserSetting(userSetting);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe(systemMessages.error.userSettingEditFailed);
        }
    });
});

describe("delete", () => {
    test("delete should delete a user.", async () => {
        // ユーザーを削除し、結果を検証する。
        await expect(userAccountManager.delete(id)).resolves.toBeUndefined();
    });

    test("delete should throw an error when id is not exist.", async () => {
        expect.assertions(1);
        try {
            // ユーザーを削除する。
            const invalidId = 2;
            await userAccountManager.delete(invalidId);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe(systemMessages.error.userDeletionFailed);
        }
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
            expect(error.message).toBe(systemMessages.error.userSettingRetrievalFailed);
        }
    });
});