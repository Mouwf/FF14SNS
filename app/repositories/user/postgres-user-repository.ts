import PostgresClientProvider from "../common/postgres-client-provider";
import User from "../../models/user/user";
import IUserRepository from "./i-user-repository";

/**
 * Postgresのユーザーリポジトリ。
 */
export default class PostgresUserRepository implements IUserRepository {
    /**
     * Postgresのユーザーリポジトリを生成する。
     * @param postgresClientProvider Postgresクライアントプロバイダー。
     */
    constructor(
        private readonly postgresClientProvider: PostgresClientProvider,
    ) {
    }

    public async create(profileId: string, authenticationProviderId: string, userName: string): Promise<boolean> {
        const client = await this.postgresClientProvider.get();
        try {
            const query = `
                INSERT INTO users (
                    profile_id,
                    authentication_provider_id,
                    user_name
                )
                VALUES (
                    $1,
                    $2,
                    $3
                );
            `;
            const values = [profileId, authenticationProviderId, userName];
            await client(query, values);
            return true;
        } catch (error) {
            throw error;
        }
    }

    public async update(user: User): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    public async delete(id: number): Promise<boolean> {
        const client = await this.postgresClientProvider.get();
        try {
            const query = `
                DELETE FROM users WHERE id = $1;
            `;
            const values = [id];
            await client(query, values);
            return true;
        } catch (error) {
            throw error;
        }
    }

    public async findById(id: string): Promise<User | null> {
        throw new Error('Method not implemented.');
    }

    public async findByProfileId(profileId: string): Promise<User | null> {
        const client = await this.postgresClientProvider.get();
        try {
            // ユーザー情報を取得する。
            const query = `
                SELECT * FROM users WHERE profile_id = $1;
            `;
            const values = [profileId];
            const response = await client(query, values);

            // ユーザーが存在しない場合、nullを返す。
            if (response.length === 0) return null;

            // ユーザー情報を生成する。
            const user = {
                id: response[0].id,
                profileId: response[0].profile_id,
                authenticationProviderId: response[0].authentication_provider_id,
                userName: response[0].user_name,
                createdAt: response[0].created_at,
            };
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async findByAuthenticationProviderId(authenticationProviderId: string): Promise<User | null> {
        const client = await this.postgresClientProvider.get();
        try {
            // ユーザー情報を取得する。
            const query = `
                SELECT * FROM users WHERE authentication_provider_id = $1;
            `;
            const values = [authenticationProviderId];
            const response = await client(query, values);

            // ユーザーが存在しない場合、nullを返す。
            if (response.length === 0) return null;

            // ユーザー情報を生成する。
            const user = {
                id: response[0].id,
                profileId: response[0].profile_id,
                authenticationProviderId: response[0].authentication_provider_id,
                userName: response[0].user_name,
                createdAt: response[0].created_at,
            };
            return user;
        } catch (error) {
            throw error;
        }
    }
}