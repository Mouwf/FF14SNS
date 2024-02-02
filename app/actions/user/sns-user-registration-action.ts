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
     * @returns 登録に成功したかどうか。
     */
    public async register(authenticationProviderId: string, userName: string): Promise<boolean> {
        const response = await this.userProfileManager.register(authenticationProviderId, userName);
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