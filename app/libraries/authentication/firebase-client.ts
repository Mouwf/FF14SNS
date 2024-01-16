import HttpClient from "../http/http-client";
import SignUpResponse from "../../models/authentication/signup-response";
import SignInWithEmailPasswordResponse from "../../models/authentication/signin-with-email-password-response";
import GetUserInformationResponse from "../../models/authentication/get-user-information-response";

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
    public async signUp(mailAddress: string, password: string): Promise<SignUpResponse> {
        // パスワードの長さが8文字未満、英数字が含まれていない場合、エラーを投げる。
        if (password.length < 8 || !password.match(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i)) {
            throw new Error("パスワードは8文字以上の英数字で設定してください。");
        }

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

    /**
     * メールアドレスとパスワードでサインインする。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @returns メールアドレスとパスワードでサインインのレスポンス。
     */
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

    /**
     * ユーザー情報を取得する。
     * @param idToken IDトークン。
     * @returns ユーザー情報。
     */
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

    /**
     * ユーザーを削除する。
     * @param idToken IDトークン。
     * @returns 削除に成功したかどうか。
     */
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