import UserProfileManager from '../../libraries/user/user-profile-manager';
import UserSetting from '../../models/user/user-setting';

/**
 * ユーザー設定を行うアクション。
 */
export default class UserSettingAction {
    /**
     * ユーザー設定を行うアクションを生成する。
     * @param userProfileManager ユーザー情報の管理を行うクラス。
     */
    constructor(
        private readonly userProfileManager: UserProfileManager,
    ) {
    }

    /**
     * ユーザー設定を更新する。
     * @param userSetting ユーザー設定。
     */
    public async editUserSetting(userSetting: UserSetting): Promise<void> {
        await this.userProfileManager.editUserSetting(userSetting);
    }
}