import UserRegistrar from "../../libraries/user/user-registrar";

/**
 * SNSのユーザー登録を行うアクション。
 */
export default class SnsUserRegistrationAction {
    /**
     * SNSのユーザー登録を行うアクションを生成する。
     * @param userRegistrar ユーザー登録を行うクラス。
     */
    constructor(
        private readonly userRegistrar: UserRegistrar,
    ) {
    }

    /**
     * ユーザーを登録する。
     * @param authenticationProviderId 認証プロバイダID。
     * @param userName ユーザー名。
     * @returns 登録に成功したかどうか。
     */
    public async register(authenticationProviderId: string, userName: string): Promise<boolean> {
        const response = await this.userRegistrar.register(authenticationProviderId, userName);
        return response;
    }

    /**
     * ユーザーを削除する。
     * @param id ユーザーID。
     * @returns 削除に成功したかどうか。
     */
    public async delete(id: number): Promise<boolean> {
        const response = await this.userRegistrar.delete(id);
        return response;
    }
}