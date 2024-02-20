import UserAccountManager from "../../libraries/authentication/user-account-manager";
import SignInWithEmailPasswordResponse from "../../models/authentication/signin-with-email-password-response";
import LoginInputErrors from "../../messages/authentication/login-input-errors";

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
     * ログインのバリデーションを行う。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @returns バリデーション結果。
     */
    public validateLogin(mailAddress: string, password: string): LoginInputErrors | null {
        const result = this.userAccountManager.validateLogin(mailAddress, password);
        return result;
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
     */
    public async logout(token: string): Promise<void> {
        await this.userAccountManager.logout(token);
    }
}
