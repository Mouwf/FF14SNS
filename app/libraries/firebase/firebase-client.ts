import HttpClient from "../http/http-client";
import SignUpResponse from "../../models/firebase/signup-response";
import SignInWithEmailPasswordResponse from "../../models/firebase/signin-with-email-password-response";
import GetUserInformationResponse from "../../models/user/get-user-information-response";

/**
 * Firebaseのクライアント。
 */
export default class FirebaseClient {
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
        if (!process.env.FIREBASE_API_KEY) {
            throw new Error("FIREBASE_API_KEYが設定されていません。");
        }
        this.firebaseApiKey = process.env.FIREBASE_API_KEY;
    }

    /**
     * サインアップする。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @returns サインアップのレスポンス。
     */
    public signUp(mailAddress: string, password: string): Promise<SignUpResponse> {
        const endpoint = "v1/accounts:signUp";
        const queries = {
            key: this.firebaseApiKey,
        };
        const body = {
            email: mailAddress,
            password: password,
            returnSecureToken: true,
        };
        return this.httpClient.post<SignUpResponse>(endpoint, queries, body);
    }

    /**
     * メールアドレスとパスワードでサインインする。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @returns メールアドレスとパスワードでサインインのレスポンス。
     */
    public signInWithEmailPassword(mailAddress: string, password: string): Promise<SignInWithEmailPasswordResponse> {
        const endpoint = 'v1/accounts:signInWithPassword';
        const queries = {
            key: this.firebaseApiKey,
        };
        const body = {
            email: mailAddress,
            password: password,
            returnSecureToken: true,
        };
        return this.httpClient.post<SignInWithEmailPasswordResponse>(endpoint, queries, body);
    }

    /**
     * ユーザー情報を取得する。
     * @param idToken IDトークン。
     * @returns ユーザー情報。
     */
    public getUserInformation(idToken: string): Promise<GetUserInformationResponse> {
        const endpoint = 'v1/accounts:lookup';
        const queries = {
            key: this.firebaseApiKey,
        };
        const body = {
          idToken: idToken
        };
        return this.httpClient.post<GetUserInformationResponse>(endpoint, queries, body);
    }
}