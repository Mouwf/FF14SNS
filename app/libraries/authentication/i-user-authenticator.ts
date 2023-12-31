import SignInWithEmailPasswordResponse from "~/models/firebase/signin-with-email-password-response";

/**
 * ユーザー認証を行うためのインターフェース。
 */
export default interface IUserAuthenticator {
    /**
     * ログインする。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @returns メールアドレスとパスワードでサインインのレスポンス。
     */
    login(mailAddress: string, password: string): Promise<SignInWithEmailPasswordResponse>;

    /**
     * ログアウトする。
     * @param token トークン。
     * @returns ログアウトに成功したかどうか。
     */
    logout(token: string): Promise<boolean>;
}