import systemMessages from "../../messages/system-messages";
import IAuthenticationClient from "./i-authentication-client";
import HttpClient from "../http/http-client";
import SignUpResponse from "../../models/authentication/signup-response";
import SignInWithEmailPasswordResponse from "../../models/authentication/signin-with-email-password-response";
import GetUserInformationResponse from "../../models/authentication/get-user-information-response";

/**
 * Firebaseのクライアント。
 */
export default class FirebaseClient implements IAuthenticationClient {
    /**
     * HTTPクライアント。
     */
    private readonly httpClient = new HttpClient("https://identitytoolkit.googleapis.com");

    /**
     * FirebaseのAPIキー。
     */
    private readonly firebaseApiKey: string;

    /**
     * Firebaseのクライアントを生成する。
     */
    constructor() {
        if (process.env.RUN_INFRA_TESTS) {
            if (!process.env.TEST_FIREBASE_API_KEY) {
                throw new Error(systemMessages.error.authenticationProviderTestEnvironmentVariableError);
            }
            process.env.FIREBASE_API_KEY = process.env.TEST_FIREBASE_API_KEY;
        }
        if (!process.env.FIREBASE_API_KEY) {
            throw new Error(systemMessages.error.authenticationProviderEnvironmentVariableError);
        }
        this.firebaseApiKey = process.env.FIREBASE_API_KEY;
    }

    public async signUp(mailAddress: string, password: string): Promise<SignUpResponse> {
        // メールアドレスとパスワードでサインアップする。
        const endpoint = "v1/accounts:signUp";
        const queries = {
            key: this.firebaseApiKey,
        };
        const body = {
            email: mailAddress,
            password: password,
            returnSecureToken: true,
        };
        return await this.httpClient.post<SignUpResponse>(endpoint, queries, body);
    }

    public async signInWithEmailPassword(mailAddress: string, password: string): Promise<SignInWithEmailPasswordResponse> {
        const endpoint = 'v1/accounts:signInWithPassword';
        const queries = {
            key: this.firebaseApiKey,
        };
        const body = {
            email: mailAddress,
            password: password,
            returnSecureToken: true,
        };
        return await this.httpClient.post<SignInWithEmailPasswordResponse>(endpoint, queries, body);
    }

    public async getUserInformation(idToken: string): Promise<GetUserInformationResponse> {
        const endpoint = 'v1/accounts:lookup';
        const queries = {
            key: this.firebaseApiKey,
        };
        const body = {
          idToken: idToken
        };
        return await this.httpClient.post<GetUserInformationResponse>(endpoint, queries, body);
    }

    public async deleteUser(idToken: string): Promise<boolean> {
        const endpoint = 'v1/accounts:delete';
        const queries = {
            key: this.firebaseApiKey
        };
        const body = {
          idToken: idToken
        };
        await this.httpClient.post<void>(endpoint, queries, body);
        return true;
    }
}