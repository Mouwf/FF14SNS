import SignUpResponse from "../../models/authentication/signup-response";
import IAuthenticationClient from "./i-authentication-client";
import IUserAuthenticator from "./i-user-authenticator";
import IUserRegistrar from "./i-user-registrar";
import SignInWithEmailPasswordResponse from "../../models/authentication/signin-with-email-password-response";


/**
 * Firebaseを利用したユーザー管理を行うクラス。
 */
export default class UserAccountManager implements IUserRegistrar, IUserAuthenticator {
    /**
     * 
     * @param authenticationClient ユーザー認証のクライアント。
     */
    constructor(
        private readonly authenticationClient: IAuthenticationClient,
    ) {
    }

    public async register(mailAddress: string, password: string): Promise<SignUpResponse> {
        const response = await this.authenticationClient.signUp(mailAddress, password);
        return response;
    }

    public async delete(token: string): Promise<boolean> {
        const response = await this.authenticationClient.deleteUser(token);
        return response;
    }

    public async login(mailAddress: string, password: string): Promise<SignInWithEmailPasswordResponse> {
        const response = await this.authenticationClient.signInWithEmailPassword(mailAddress, password);
        return response;
    }

    public async logout(token: string): Promise<boolean> {
        return true;
    }
}