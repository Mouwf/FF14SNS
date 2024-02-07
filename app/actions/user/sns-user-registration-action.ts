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
     * @returns 登録に成功したかどうか。
     */
    public async register(authenticationProviderId: string, userName: string, currentReleaseInformationId: number): Promise<boolean> {
        const response = await this.userProfileManager.register(authenticationProviderId, userName, currentReleaseInformationId);
        return response;
    }

    /**
     * ユーザーを削除する。
     * @param id ユーザーID。
     * @returns 削除に成功したかどうか。
     */
    public async delete(id: number): Promise<boolean> {
        const response = await this.userProfileManager.delete(id);
        return response;
    }
}