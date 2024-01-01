import FF14SnsUser from "../../../app/libraries/user/ff14-sns-user";
import IAuthenticatedUserProvider from "../../../app/libraries/user/i-authenticated-user-provider";

/**
 * 認証済みユーザーを提供するモッククラス。
 */
export default class MockAuthenticatedUserProvider implements IAuthenticatedUserProvider {
    public async getUser(token: string): Promise<FF14SnsUser> {
        // トークンが不正な場合、エラーを投げる。
        if (token !== "idToken") {
            throw new Error("Invalid token.");
        }

        // ユーザー情報を返す。
        return {
            name: "UserName",
        };
    }
}