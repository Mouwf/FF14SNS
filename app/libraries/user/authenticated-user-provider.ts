import AuthenticatedUser from "../../models/user/authenticated-user";
import IAuthenticatedUserProvider from "./i-authenticated-user-provider";
import IAuthenticationClient from "../authentication/i-authentication-client";
import IUserRepository from "../../repositories/user/i-user-repository";

/**
 * 認証済みユーザーを提供するクラス。
 */
export default class AuthenticatedUserProvider implements IAuthenticatedUserProvider {
    /**
     * 認証済みユーザーを提供するクラスを生成する。
     * @param authenticationClient ユーザー認証のクライアント。
     * @param userRepository ユーザーリポジトリ。
     */
    constructor(
        private readonly authenticationClient: IAuthenticationClient,
        private readonly userRepository: IUserRepository,
    ) {
    }

    public async getUser(token: string): Promise<AuthenticatedUser | null> {
        // ユーザー情報を取得する。
        const clientResponse = await this.authenticationClient.getUserInformation(token);
        const repositoryResponse = await this.userRepository.findByAuthenticationProviderId(clientResponse.users[0].localId);

        // ユーザーが存在しない場合、nullを返す。
        if (repositoryResponse === null) return null;

        // ユーザー情報を生成する。
        const authenticatedUser = {
            id: repositoryResponse.id,
            profileId: repositoryResponse.profileId,
            authenticationProviderId: repositoryResponse.authenticationProviderId,
            userName: repositoryResponse.userName,
            createdAt: new Date(Number(repositoryResponse.createdAt)),
        };
        return authenticatedUser;
    }

    public async getAuthenticationProviderId(token: string): Promise<string> {
        // ユーザー情報を取得する。
        const clientResponse = await this.authenticationClient.getUserInformation(token);

        // 認証プロバイダIDを取得する。
        const authenticationProviderId = clientResponse.users[0].localId;
        return authenticationProviderId;
    }
}