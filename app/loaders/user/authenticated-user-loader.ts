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
     * ユーザーが存在しない場合、nullを返す。
     */
    public async getUserByToken(token: string): Promise<AuthenticatedUser | null> {
        const authenticatedUser = await this.authenticatedUserProvider.getUserByToken(token);
        return authenticatedUser;
    }

    /**
     * プロフィールIDで認証済みユーザーを取得する。
     * @param profileId プロフィールID。
     * @returns 認証済みユーザー。
     */
    public async getUserByProfileId(profileId: string): Promise<AuthenticatedUser | null> {
        const authenticatedUser = await this.authenticatedUserProvider.getUserByProfileId(profileId);
        return authenticatedUser;
    }

    /**
     * 認証プロバイダIDを取得する。
     * @param token トークン。
     * @returns 認証プロバイダID。
     */
    public async getAuthenticationProviderId(token: string): Promise<string> {
        const authenticationProviderId = await this.authenticatedUserProvider.getAuthenticationProviderId(token);
        return authenticationProviderId;
    }
}
