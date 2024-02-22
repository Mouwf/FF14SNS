import systemMessages from "../../messages/system-messages";
import SignUpResponse from "../../models/authentication/signup-response";
import IAuthenticationClient from "./i-authentication-client";
import SignInWithEmailPasswordResponse from "../../models/authentication/signin-with-email-password-response";
import SignUpValidator from "./sign-up-validator";
import AuthenticationUserRegistrationInputErrors from "../../messages/authentication/authentication-user-registration-input-errors";
import LoginInputErrors from "../../messages/authentication/login-input-errors";
import LoginValidator from "./login-validator";

/**
 * 認証ユーザー管理を行うクラス。
 */
export default class UserAccountManager {
    /**
     * 認証ユーザー管理を行うクラスを生成する。
     * @param authenticationClient ユーザー認証のクライアント。
     */
    constructor(
        private readonly authenticationClient: IAuthenticationClient,
    ) {
    }

    /**
     * 認証ユーザー登録のバリデーションを行う。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @param confirmPassword 再確認パスワード。
     * @returns バリデーション結果。
     */
    public validateRegistrationUser(mailAddress: string, password: string, confirmPassword: string): AuthenticationUserRegistrationInputErrors | null {
        try {
            const result = SignUpValidator.validate(mailAddress, password, confirmPassword);
            return result;
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            if (error instanceof Error) throw new Error(error.message);
            throw new Error(systemMessages.error.signUpFailed);
        }
    }

    /**
     * 認証ユーザーを登録する。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @param confirmPassword 再確認パスワード。
     * @returns サインアップのレスポンス。
     */
    public async register(mailAddress: string, password: string, confirmPassword: string): Promise<SignUpResponse> {
        try {
            // ユーザーを登録する。
            const response = await this.authenticationClient.signUp(mailAddress, password);
            return response;
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.signUpFailed);
        }
    }

    /**
     * 認証ユーザーを削除する。
     * @param token トークン。
     */
    public async delete(token: string): Promise<void> {
        try {
            const response = await this.authenticationClient.deleteUser(token);
            if (!response) throw new Error(systemMessages.error.authenticationUserDeletionFailed);
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.authenticationUserDeletionFailed);
        }
    }

    /**
     * ログインのバリデーションを行う。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @returns バリデーション結果。
     */
    public validateLogin(mailAddress: string, password: string): LoginInputErrors | null {
        try {
            const result = LoginValidator.validate(mailAddress, password);
            return result;
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            if (error instanceof Error) throw new Error(error.message);
            throw new Error(systemMessages.error.invalidMailAddressOrPassword);
        }
    }

    /**
     * ログインする。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @returns メールアドレスとパスワードでサインインのレスポンス。
     */
    public async login(mailAddress: string, password: string): Promise<SignInWithEmailPasswordResponse> {
        try {
            const response = await this.authenticationClient.signInWithEmailPassword(mailAddress, password);
            return response;
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.invalidMailAddressOrPassword);
        }
    }

    /**
     * ログアウトする。
     * @param token トークン。
     */
    public async logout(token: string): Promise<void> {
        try {
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.logoutFailed);
        }
    }
}