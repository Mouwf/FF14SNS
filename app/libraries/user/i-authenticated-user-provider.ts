import AuthenticatedUser from "../../models/user/authenticated-user";

/**
 * 認証済みユーザーを提供するインターフェース。
 */
export default interface IAuthenticatedUserProvider {
    /**
     * 認証済みユーザーを取得する。
     * @param token トークン。
     * @returns 認証済みユーザー。
     * ユーザーが存在しない場合、nullを返す。
     */
    getUser(token: string): Promise<AuthenticatedUser | null>;

    /**
     * 認証プロバイダIDを取得する。
     * @param token トークン。
     * @returns 認証プロバイダID。
     */
    getAuthenticationProviderId(token: string): Promise<string>;
}