import FF14SnsUser from "../../models/user/ff14-sns-user";
import IAuthenticatedUserProvider from "../../libraries/user/i-authenticated-user-provider";

/**
 * FF14SNSのユーザーを取得するローダー。
 */
export default class FF14SnsUserLoader {
    /**
     * FF14SNSのユーザーを取得するローダーを生成する。
     * @param authenticatedUserProvider 認証済みユーザーを提供するクラス。
     */
    constructor(private readonly authenticatedUserProvider: IAuthenticatedUserProvider) {
    }

    /**
     * FF14SNSのユーザーを取得する。
     * @param token トークン。
     * @returns FF14SNSのユーザー。
     */
    public async getUser(token: string): Promise<FF14SnsUser> {
        const ff14SnsUser = await this.authenticatedUserProvider.getUser(token);
        return ff14SnsUser;
    }
}
