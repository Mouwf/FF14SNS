import systemMessages from "../../messages/system-messages";
import AuthenticatedUser from "../../models/user/authenticated-user";
import IAuthenticationClient from "../authentication/i-authentication-client";
import IUserRepository from "../../repositories/user/i-user-repository";

/**
 * 認証済みユーザーを提供するクラス。
 */
export default class AuthenticatedUserProvider {
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

    /**
     * トークンで認証済みユーザーを取得する。
     * @param token トークン。
     * @returns 認証済みユーザー。
     * ユーザーが存在しない場合、nullを返す。
     */
    public async getUserByToken(token: string): Promise<AuthenticatedUser | null> {
        try {
            // ユーザー情報を取得する。
            const clientResponse = await this.authenticationClient.getUserInformation(token);
            const repositoryResponse = await this.userRepository.findByAuthenticationProviderId(clientResponse.users[0].localId);

            // ユーザー情報が存在しない場合、nullを返す。
            if (repositoryResponse === null) return null;

            // 認証済みユーザーを生成する。
            const authenticatedUser = {
                id: repositoryResponse.id,
                profileId: repositoryResponse.profileId,
                authenticationProviderId: repositoryResponse.authenticationProviderId,
                userName: repositoryResponse.userName,
                currentReleaseVersion: repositoryResponse.currentReleaseVersion,
                currentReleaseName: repositoryResponse.currentReleaseName,
                createdAt: new Date(Number(repositoryResponse.createdAt)),
            };
            return authenticatedUser;
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.userInformationRetrievalFailed);
        }
    }

    /**
     * プロフィールIDで認証済みユーザーを取得する。
     * @param profileId プロフィールID。
     */
    public async getUserByProfileId(profileId: string): Promise<AuthenticatedUser> {
        try {
            // ユーザー情報を取得する。
            const repositoryResponse = await this.userRepository.findByProfileId(profileId);

            // ユーザー情報が存在しない場合、nullを返す。
            if (repositoryResponse === null) throw new Error(systemMessages.error.userNotExists);

            // 認証済みユーザーを生成する。
            const authenticatedUser = {
                id: repositoryResponse.id,
                profileId: repositoryResponse.profileId,
                authenticationProviderId: repositoryResponse.authenticationProviderId,
                userName: repositoryResponse.userName,
                currentReleaseVersion: repositoryResponse.currentReleaseVersion,
                currentReleaseName: repositoryResponse.currentReleaseName,
                createdAt: new Date(Number(repositoryResponse.createdAt)),
            };
            return authenticatedUser;
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.userInformationRetrievalFailed);
        }
    }

    /**
     * 認証プロバイダIDを取得する。
     * @param token トークン。
     * @returns 認証プロバイダID。
     */
    public async getAuthenticationProviderId(token: string): Promise<string> {
        try {
            // ユーザー情報を取得する。
            const clientResponse = await this.authenticationClient.getUserInformation(token);

            // 認証プロバイダIDを取得する。
            const authenticationProviderId = clientResponse.users[0].localId;
            return authenticationProviderId;
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.authenticationFailed);
        }
    }
}