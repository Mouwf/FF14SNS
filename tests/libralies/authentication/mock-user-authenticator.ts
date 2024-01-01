import SignInWithEmailPasswordResponse from "../../../app/models/firebase/signin-with-email-password-response";
import IUserAuthenticator from "../../../app/libraries/authentication/i-user-authenticator";

export default class MockUserAuthenticator implements IUserAuthenticator {
    public async login(mailAddress: string, password: string): Promise<SignInWithEmailPasswordResponse> {
        throw new Error("Method not implemented.");
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