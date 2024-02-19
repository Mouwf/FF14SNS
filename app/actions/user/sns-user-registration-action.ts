import UserProfileManager from "../../libraries/user/user-profile-manager";

/**
 * SNSのユーザー登録を行うアクション。
 */
export default class SnsUserRegistrationAction {
    /**
     * SNSのユーザー登録を行うアクションを生成する。
     * @param userProfileManager ユーザー登録を行うクラス。
     */
    constructor(
        private readonly userProfileManager: UserProfileManager,
    ) {
    }

    /**
     * ユーザーを登録する。
     * @param authenticationProviderId 認証プロバイダID。
     * @param userName ユーザー名。
     * @param currentReleaseInformationId 現在のリリース情報ID。
     */
    public async register(authenticationProviderId: string, userName: string, currentReleaseInformationId: number): Promise<void> {
        await this.userProfileManager.register(authenticationProviderId, userName, currentReleaseInformationId);
    }

    /**
     * ユーザーを削除する。
     * @param id ユーザーID。
     */
    public async delete(id: number): Promise<void> {
        await this.userProfileManager.delete(id);
    }
}