import SignUpResponse from "../../models/authentication/signup-response";
import IAuthenticationClient from "./i-authentication-client";
import SignInWithEmailPasswordResponse from "../../models/authentication/signin-with-email-password-response";


/**
 * ユーザー管理を行うクラス。
 */
export default class UserAccountManager {
    /**
     * ユーザー管理を行うクラスを生成する。
     * @param authenticationClient ユーザー認証のクライアント。
     */
    constructor(
        private readonly authenticationClient: IAuthenticationClient,
    ) {
    }

    /**
     * ユーザーを登録する。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @returns サインアップのレスポンス。
     */
    public async register(mailAddress: string, password: string): Promise<SignUpResponse> {
        const response = await this.authenticationClient.signUp(mailAddress, password);
        return response;
    }

    /**
     * ユーザーを削除する。
     * @param token トークン。
     * @returns 削除に成功したかどうか。
     */
    public async delete(token: string): Promise<boolean> {
        const response = await this.authenticationClient.deleteUser(token);
        return response;
    }

    /**
     * ログインする。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @returns メールアドレスとパスワードでサインインのレスポンス。
     */
    public async login(mailAddress: string, password: string): Promise<SignInWithEmailPasswordResponse> {
        const response = await this.authenticationClient.signInWithEmailPassword(mailAddress, password);
        return response;
    }

    /**
     * ログアウトする。
     * @param token トークン。
     * @returns ログアウトに成功したかどうか。
     */
    public async logout(token: string): Promise<boolean> {
        return true;
    }
}