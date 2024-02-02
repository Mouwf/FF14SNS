import UserProfileManager from '../../libraries/user/user-profile-manager';
import UserSetting from '../../models/user/user-setting';

/**
 * ユーザー設定を取得するローダー。
 */
export default class UserSettingLoader {
    /**
     * ユーザー設定を取得するローダーを生成する。
     * @param userProfileManager ユーザー情報の管理を行うクラス。
     */
    constructor(
        private readonly userProfileManager: UserProfileManager,
    ) {
    }

    /**
     * プロフィールIDからユーザー設定を取得する。
     * @param profileId プロフィールID。
     * @returns ユーザー設定。
     */
    public async getUserSettingByProfileId(profileId: string): Promise<UserSetting> {
        const userSetting = await this.userProfileManager.fetchUserSettingByProfileId(profileId);
        return userSetting;
    }
}