import SignInWithEmailPasswordResponse from "../../../app/models/authentication/signin-with-email-password-response";
import IUserAuthenticator from "../../../app/libraries/authentication/i-user-authenticator";

/**
 * ユーザー認証を行うモッククラス。
 */
export default class MockUserAuthenticator implements IUserAuthenticator {
    public async login(mailAddress: string, password: string): Promise<SignInWithEmailPasswordResponse> {
        // メールアドレスが不正な場合、エラーを投げる。
        if (mailAddress !== "test@example.com") {
            throw new Error("Invalid mail address.");
        }

        // パスワードが不正な場合、エラーを投げる。
        if (password !== "testPassword123") {
            throw new Error("Invalid password.");
        }

        // メールアドレスとパスワードでサインインのレスポンスを返す。
        const response = {
            displayName: "DisplayName",
            idToken: "idToken",
            email: "test@example.com",
            refreshToken: "refreshToken",
            expiresIn: "3600",
            localId: "localId",
            registered: true,
        };
        return response;
    }

    public async logout(token: string): Promise<boolean> {
        // トークンが不正な場合、エラーを投げる。
        if (token !== "idToken") {
            throw new Error("Invalid token.");
        }

        // ログアウトに成功したとする。
        return true;
    }
}