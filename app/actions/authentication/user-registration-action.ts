import UserAccountManager from "../../libraries/authentication/user-account-manager";
import SignUpResponse from "../../models/authentication/signup-response";

/**
 * 認証するユーザーの登録をを行うアクション。
 */
export default class UserRegistrationAction {
    /**
     * 認証するユーザーの登録を行うアクションを生成する。
     * @param userAccountManager ユーザー管理を行うクラス。
     */
    constructor(
        private readonly userAccountManager: UserAccountManager,
    ) {
    }

    /**
     * ユーザーを登録する。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @returns サインアップのレスポンス。
     */
    public async register(mailAddress: string, password: string): Promise<SignUpResponse> {
        const response = await this.userAccountManager.register(mailAddress, password);
        return response;
    }

    /**
     * ユーザーを削除する。
     * @param token トークン。
     * @returns 削除に成功したかどうか。
     */
    public async delete(token: string): Promise<boolean> {
        const response = await this.userAccountManager.delete(token);
        return response;
    }
}
