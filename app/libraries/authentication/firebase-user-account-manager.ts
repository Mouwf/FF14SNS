import SignUpResponse from "../../models/authentication/signup-response";
import FirebaseClient from "./firebase-client";
import IUserAuthenticator from "./i-user-authenticator";
import IUserRegistrar from "./i-user-registrar";
import SignInWithEmailPasswordResponse from "../../models/authentication/signin-with-email-password-response";


/**
 * Firebaseを利用したユーザー管理を行うクラス。
 */
export default class FirebaseUserAccountManager implements IUserRegistrar, IUserAuthenticator {
    /**
     * Firebaseのクライアント。
     */
    private readonly firebaseClient = new FirebaseClient();

    public async register(mailAddress: string, password: string): Promise<SignUpResponse> {
        const response = await this.firebaseClient.signUp(mailAddress, password);
        return response;
    }

    public async delete(token: string): Promise<boolean> {
        const response = await this.firebaseClient.deleteUser(token);
        return response;
    }

    public async login(mailAddress: string, password: string): Promise<SignInWithEmailPasswordResponse> {
        const response = await this.firebaseClient.signInWithEmailPassword(mailAddress, password);
        return response;
    }

    public async logout(token: string): Promise<boolean> {
        return true;
    }
}