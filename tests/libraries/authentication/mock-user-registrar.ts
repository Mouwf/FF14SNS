import SignUpResponse from "../../../app/models/firebase/signup-response";
import IUserRegistrar from "../../../app/libraries/authentication/i-user-registrar";

export default class MockUserRegistrar implements IUserRegistrar {
    public async register(mailAddress: string, password: string): Promise<SignUpResponse> {
        // メールアドレスが無効な場合、エラーを投げる。
        if (mailAddress !== "test@example.com") {
            throw new Error("Invalid mail address.");
        }

        // パスワードが無効な場合、エラーを投げる。
        if (password !== "testPassword123") {
            throw new Error("Invalid password.");
        }

        // サインアップのレスポンスを返す。
        return {
            idToken: "idToken",
            email: "test@example.com",
            refreshToken: "refreshToken",
            expiresIn: "3600",
            localId: "localId",
        };
    }

    delete(mailAddress: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}