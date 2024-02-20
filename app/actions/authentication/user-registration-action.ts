import UserAccountManager from "../../libraries/authentication/user-account-manager";
import SignUpResponse from "../../models/authentication/signup-response";
import AuthenticationUserRegistrationInputErrors from "../../messages/authentication/authentication-user-registration-input-errors";

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
     * ユーザー登録のバリデーションを行う。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @param confirmPassword 再確認パスワード。
     * @returns バリデーション結果。
     */
    public validateRegistrationUser(mailAddress: string, password: string, confirmPassword: string): AuthenticationUserRegistrationInputErrors | null {
        const result = this.userAccountManager.validateRegistrationUser(mailAddress, password, confirmPassword);
        return result;
    }

    /**
     * ユーザーを登録する。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @param confirmPassword 再確認パスワード。
     * @returns サインアップのレスポンス。
     */
    public async register(mailAddress: string, password: string, confirmPassword: string): Promise<SignUpResponse> {
        const response = await this.userAccountManager.register(mailAddress, password, confirmPassword);
        return response;
    }

    /**
     * ユーザーを削除する。
     * @param token トークン。
     */
    public async delete(token: string): Promise<void> {
        await this.userAccountManager.delete(token);
    }
}
