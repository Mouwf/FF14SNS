import { describe, test, expect, beforeEach } from "@jest/globals";
import MockUserRepository from "../../repositories/user/mock-user-repository";
import UserProfileManager from "../../../app/libraries/user/user-profile-manager";
import UserSettingLoader from "../../../app/loaders/user/user-setting-loader";

/**
 * ユーザー設定を取得するローダー。
 */
let userSettingLoader: UserSettingLoader;

beforeEach(() => {
    const mockUserRepository = new MockUserRepository();
    const userProfileManager = new UserProfileManager(mockUserRepository);
    userSettingLoader = new UserSettingLoader(userProfileManager);
});

describe("fetchUserSettingByProfileId", () => {
    test("fetchUserSettingByProfileId should get user setting and return user setting.", async () => {
        // ユーザー設定を取得する。
        const profileId = "username_world1";
        const response = await userSettingLoader.fetchUserSettingByProfileId(profileId);

        // 結果を検証する。
        expect(response.userId).toBe("username_world1");
        expect(response.userName).toBe("UserName@World1");
        expect(response.currentReleaseInformationId).toBe(1);
    });
});