import FF14SnsUser from "../../models/user/ff14-sns-user";

/**
 * 認証済みユーザーを提供するインターフェース。
 */
export default interface IAuthenticatedUserProvider {
    /**
     * 認証済みユーザーを取得する。
     * @param token トークン。
     * @returns 認証済みユーザー。
     */
    getUser(token: string): Promise<FF14SnsUser>;
}