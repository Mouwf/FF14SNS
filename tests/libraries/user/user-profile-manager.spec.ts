import { describe, test, expect, beforeEach } from "@jest/globals";
import MockUserRepository from "../../repositories/user/mock-user-repository";
import UserProfileManager from "../../../app/libraries/user/user-profile-manager";
import systemMessages from "../../../app/messages/system-messages";

/**
 * ユーザーの登録を行うクラス。
 */
let userProfileManager: UserProfileManager;

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
    userProfileManager = new UserProfileManager(mockUserRepository);
});

describe("validateRegistrationUser", () => {
    test("validateRegistrationUser should validate registration user.", () => {
        // ユーザー登録のバリデーションを行う。
        const response = userProfileManager.validateRegistrationUser(authenticationProviderId, userName);

        // 結果を検証する。
        expect(response).toBeNull();
    });

    test("validateRegistrationUser should throw an error when authentication provider id is empty.", () => {
        expect.assertions(1);
        try {
            // 無効な認証プロバイダIDでユーザー登録のバリデーションを行う。
            const invalidAuthenticationProviderId = "";
            userProfileManager.validateRegistrationUser(invalidAuthenticationProviderId, userName);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe(systemMessages.error.userRegistrationFailed);
        }
    });

    test("validateRegistrationUser should return error message for invalid user name.", () => {
        // 無効なユーザー名でユーザー登録のバリデーションを行う。
        const invalidUserName = "invalidUserName";
        const response = userProfileManager.validateRegistrationUser(authenticationProviderId, invalidUserName);

        // 結果を検証する。
        const expectedResponse = {
            userName: [
                systemMessages.error.invalidUserName,
            ],
        };
        expect(response).toEqual(expectedResponse);
    });
});

describe("register", () => {
    test("register should register a user.", async () => {
        // ユーザーを登録し、結果を検証する。
        await expect(userProfileManager.register(authenticationProviderId, userName, currentReleaseInformationId)).resolves.toBeUndefined();
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
        await expect(userProfileManager.editUserSetting(userSetting)).resolves.toBeUndefined();
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
            await userProfileManager.editUserSetting(userSetting);
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
            await userProfileManager.editUserSetting(userSetting);
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
        await expect(userProfileManager.delete(id)).resolves.toBeUndefined();
    });

    test("delete should throw an error when id is not exist.", async () => {
        expect.assertions(1);
        try {
            // ユーザーを削除する。
            const invalidId = 2;
            await userProfileManager.delete(invalidId);
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
        const response = await userProfileManager.fetchUserSettingByProfileId(profileId);

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
            await userProfileManager.fetchUserSettingByProfileId(invalidProfileId);
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