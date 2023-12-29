import IUserAuthenticator from "../../libraries/authentication/i-user-authenticator";
import SignInWithEmailPasswordResponse from "../../models/firebase/signin-with-email-password-response";

/**
 * ユーザー認証を行うアクション。
 */
export default class UserAuthenticationAction {
    /**
     * ユーザー認証を行うアクションを生成する。
     * @param userAuthenticator 
     */
    constructor(private readonly userAuthenticator: IUserAuthenticator) {
    }

    /**
     * ログインする。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @returns メールアドレスとパスワードでサインインのレスポンス。
     */
    public login(mailAddress: string, password: string): Promise<SignInWithEmailPasswordResponse> {
        const response = this.userAuthenticator.login(mailAddress, password);
        return response;
    }

    /**
     * ログアウトする。
     * @returns ログアウトに成功したかどうか。
     */
    public logout(): Promise<boolean> {
        const response = this.userAuthenticator.logout();
        return response;
    }
}
