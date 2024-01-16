import AuthenticatedUser from "../../models/user/authenticated-user";
import IAuthenticatedUserProvider from "../../libraries/user/i-authenticated-user-provider";

/**
 * 認証済みユーザーを取得するローダー。
 */
export default class AuthenticatedUserLoader {
    /**
     * 認証済みユーザーを取得するローダーを生成する。
     * @param authenticatedUserProvider 認証済みユーザーを提供するクラス。
     */
    constructor(
        private readonly authenticatedUserProvider: IAuthenticatedUserProvider
    ) {
    }

    /**
     * 認証済みユーザーを取得する。
     * @param token トークン。
     * @returns 認証済みユーザー。
     */
    public async getUser(token: string): Promise<AuthenticatedUser> {
        const authenticatedUser = await this.authenticatedUserProvider.getUser(token);
        return authenticatedUser;
    }
}
