import IAuthenticationClient from '../../../app/libraries/authentication/i-authentication-client';
import GetUserInformationResponse from '../../../app/models/authentication/get-user-information-response';
import SignInWithEmailPasswordResponse from '../../../app/models/authentication/signin-with-email-password-response';
import SignUpResponse from '../../../app/models/authentication/signup-response';

/**
 * ユーザー認証を行うモッククライアント。
 */
export default class MockAuthenticationClient implements IAuthenticationClient {
    public async signUp(mailAddress: string, password: string): Promise<SignUpResponse> {
        // メールアドレスが無効な場合、エラーを投げる。
        if (mailAddress !== "test@example.com") {
            throw new Error("Invalid mail address.");
        }

        // パスワードが無効な場合、エラーを投げる。
        if (password !== "testPassword123") {
            throw new Error("Invalid password.");
        }

        // サインアップのレスポンスを返す。
        return await {
            idToken: "idToken",
            email: "test@example.com",
            refreshToken: "refreshToken",
            expiresIn: "3600",
            localId: "authenticationProviderId",
        };
    }

    public async signInWithEmailPassword(mailAddress: string, password: string): Promise<SignInWithEmailPasswordResponse> {
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
            localId: "authenticationProviderId",
            registered: true,
        };
        return await response;
    }

    public async getUserInformation(idToken: string): Promise<GetUserInformationResponse> {
        // トークンが無効な場合、エラーを投げる。
        if (idToken === "invalidIdToken") {
            throw new Error("Invalid token.");
        }

        // ユーザーが存在しないIDトークンの場合、現在のユーザーの uidを無効のものにする。
        let localId = "authenticationProviderId";
        if (idToken !== "idToken") {
            localId = "invalidAuthenticationProviderId";
        }

        // ユーザー情報を返す。
        const providerUserInfo = [
            {
                providerId: "providerId",
                displayName: "DisplayName",
                photoUrl: "https://example.com/photo.png",
                federatedId: "federatedId",
                email: "test@example.com",
                rawId: "rawId",
                screenName: "screenName",
            }
        ];
        const userInformation = [
            {
                localId: localId,
                email: "test@example.com",
                emailVerified: true,
                displayName: "DisplayName",
                providerUserInfo: providerUserInfo,
                photoUrl: "https://example.com/photo.png",
                passwordHash: "passwordHash",
                passwordUpdatedAt: 0,
                validSince: "validSince",
                disabled: false,
                lastLoginAt: "lastLoginAt",
                createdAt: "1705409410669",
                customAuth: false,
            },
        ];
        return {
            users: userInformation
        };
    }

    public async deleteUser(idToken: string): Promise<boolean> {
        // トークンが無効な場合、エラーを投げる。
        if (idToken !== "idToken") {
            throw new Error("Invalid token.");
        }

        // ユーザー削除に成功したとする。
        return true;
    }
}