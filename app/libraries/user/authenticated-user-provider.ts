import AuthenticatedUser from "../../models/user/authenticated-user";
import IAuthenticatedUserProvider from "./i-authenticated-user-provider";
import IAuthenticationClient from "../authentication/i-authentication-client";

/**
 * 認証済みユーザーを提供するクラス。
 */
export default class AuthenticatedUserProvider implements IAuthenticatedUserProvider {
    /**
     * 
     * @param authenticationClient ユーザー認証のクライアント。
     */
    constructor(
        private readonly authenticationClient: IAuthenticationClient,
    ) {
    }

    public async getUser(token: string): Promise<AuthenticatedUser> {
        const response = await this.authenticationClient.getUserInformation(token);
        const authenticatedUser = {
            id: response.users[0].localId,
            profileId: response.users[0].localId,
            authenticationProviderId: response.users[0].localId,
            userName: response.users[0].email,
            createdAt: new Date(Number(response.users[0].createdAt)),
        };
        return authenticatedUser;
    }
}