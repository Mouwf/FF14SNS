import IUserAuthenticator from "../../libraries/authentication/i-user-authenticator";
import SignInWithEmailPasswordResponse from "../../models/authentication/signin-with-email-password-response";

/**
 * ユーザー認証を行うアクション。
 */
export default class UserAuthenticationAction {
    /**
     * ユーザー認証を行うアクションを生成する。
     * @param userAuthenticator ユーザー認証を行うクラス。
     */
    constructor(
        private readonly userAuthenticator: IUserAuthenticator
    ) {
    }

    /**
     * ログインする。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @returns メールアドレスとパスワードでサインインのレスポンス。
     */
    public async login(mailAddress: string, password: string): Promise<SignInWithEmailPasswordResponse> {
        const response = await this.userAuthenticator.login(mailAddress, password);
        return response;
    }

    /**
     * ログアウトする。
     * @returns ログアウトに成功したかどうか。
     */
    public async logout(token: string): Promise<boolean> {
        const response = await this.userAuthenticator.logout(token);
        return response;
    }
}
