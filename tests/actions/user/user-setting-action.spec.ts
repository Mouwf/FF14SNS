import { describe, test, expect, beforeEach } from "@jest/globals";
import MockUserRepository from "../../repositories/user/mock-user-repository";
import UserProfileManager from "../../../app/libraries/user/user-profile-manager";
import UserSettingAction from "../../../app/actions/user/user-setting-action";

/**
 * ユーザー設定を行うアクション。
 */
let userSettingAction: UserSettingAction;

beforeEach(() => {
    const mockUserRepository = new MockUserRepository();
    const userProfileManager = new UserProfileManager(mockUserRepository);
    userSettingAction = new UserSettingAction(userProfileManager);
});

describe("editUserSetting", () => {
    test("editUserSetting should edit user setting.", async () => {
        // ユーザー設定を更新し、結果を検証する。
        const userSetting = {
            userId: "username_world1",
            userName: "UserName@World1",
            currentReleaseInformationId: 1,
        };
        await expect(userSettingAction.editUserSetting(userSetting)).resolves.toBeUndefined();
    });
});