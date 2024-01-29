import SignUpResponse from "../../models/authentication/signup-response";
import SignInWithEmailPasswordResponse from "../../models/authentication/signin-with-email-password-response";
import GetUserInformationResponse from "../../models/authentication/get-user-information-response";

/**
 * ユーザー認証のクライアント。
 */
export default interface IAuthenticationClient {
    /**
     * サインアップする。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @returns サインアップのレスポンス。
     */
    signUp(mailAddress: string, password: string): Promise<SignUpResponse>;

    /**
     * メールアドレスとパスワードでサインインする。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @returns メールアドレスとパスワードでサインインのレスポンス。
     */
    signInWithEmailPassword(mailAddress: string, password: string): Promise<SignInWithEmailPasswordResponse>;

    /**
     * ユーザー情報を取得する。
     * @param idToken IDトークン。
     * @returns ユーザー情報。
     */
    getUserInformation(idToken: string): Promise<GetUserInformationResponse>;

    /**
     * ユーザーを削除する。
     * @param idToken IDトークン。
     * @returns 削除に成功したかどうか。
     */
    deleteUser(idToken: string): Promise<boolean>;
}