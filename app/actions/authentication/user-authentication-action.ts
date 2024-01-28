import UserAccountManager from "../../libraries/authentication/user-account-manager";
import SignInWithEmailPasswordResponse from "../../models/authentication/signin-with-email-password-response";

/**
 * ユーザー認証を行うアクション。
 */
export default class UserAuthenticationAction {
    /**
     * ユーザー認証を行うアクションを生成する。
     * @param userAccountManager ユーザー管理を行うクラス。
     */
    constructor(
        private readonly userAccountManager: UserAccountManager
    ) {
    }

    /**
     * ログインする。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @returns メールアドレスとパスワードでサインインのレスポンス。
     */
    public async login(mailAddress: string, password: string): Promise<SignInWithEmailPasswordResponse> {
        const response = await this.userAccountManager.login(mailAddress, password);
        return response;
    }

    /**
     * ログアウトする。
     * @returns ログアウトに成功したかどうか。
     */
    public async logout(token: string): Promise<boolean> {
        const response = await this.userAccountManager.logout(token);
        return response;
    }
}
