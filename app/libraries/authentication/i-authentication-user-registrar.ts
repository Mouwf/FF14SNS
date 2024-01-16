import SignUpResponse from "../../models/authentication/signup-response";

/**
 * 認証するユーザーの登録を行うためのインターフェース。
 */
export default interface IAuthenticationUserRegistrar {
    /**
     * ユーザーを登録する。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @returns サインアップのレスポンス。
     */
    register(mailAddress: string, password: string): Promise<SignUpResponse>;

    /**
     * ユーザーを削除する。
     * @param token トークン。
     * @returns 削除に成功したかどうか。
     */
    delete(token: string): Promise<boolean>;
}