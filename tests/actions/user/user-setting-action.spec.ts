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
    test("editUserSetting should edit user setting and return true.", async () => {
        // ユーザー設定を更新する。
        const userSetting = {
            userId: "username_world1",
            userName: "UserName@World1",
            currentReleaseInformationId: 1,
        };
        const response = await userSettingAction.editUserSetting(userSetting);

        // 結果を検証する。
        expect(response).toBe(true);
    });
});