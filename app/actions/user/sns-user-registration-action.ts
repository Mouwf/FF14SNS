import IUserRegistrar from "../../libraries/user/i-user-registrar";

/**
 * SNSのユーザー登録を行うアクション。
 */
export default class SnsUserRegistrationAction {
    /**
     * SNSのユーザー登録を行うアクションを生成する。
     * @param userRegistrar ユーザー登録を行うクラス。
     */
    constructor(
        private readonly userRegistrar: IUserRegistrar,
    ) {
    }

    /**
     * ユーザーを登録する。
     * @param authenticationProvidedId 認証プロバイダID。
     * @param userName ユーザー名。
     * @returns 登録に成功したかどうか。
     */
    public async register(authenticationProvidedId: string, userName: string): Promise<boolean> {
        const response = await this.userRegistrar.register(authenticationProvidedId, userName);
        return response;
    }

    /**
     * ユーザーを削除する。
     * @param id ユーザーID。
     * @returns 削除に成功したかどうか。
     */
    public async delete(id: string): Promise<boolean> {
        const response = await this.userRegistrar.delete(id);
        return response;
    }
}