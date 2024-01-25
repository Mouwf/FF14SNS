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
            await client.query("BEGIN");

            // ユーザーを作成する。
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
            const result = await client.query(query, values);

            // 結果がない場合、falseを返す。
            if (result.rowCount === 0) return false;

            // コミットする。
            await client.query("COMMIT");
            return true;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    public async update(user: User): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    public async delete(id: number): Promise<boolean> {
        const client = await this.postgresClientProvider.get();
        try {
            await client.query("BEGIN");

            // ユーザーを削除する。
            const query = `
                DELETE FROM users WHERE id = $1;
            `;
            const values = [id];
            const result = await client.query(query, values);

            // 結果がない場合、falseを返す。
            if (result.rowCount === 0) return false;

            // コミットする。
            await client.query("COMMIT");
            return true;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
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
            const result = await client.query(query, values);

            // ユーザーが存在しない場合、nullを返す。
            if (result.rows.length === 0) return null;

            // ユーザー情報を生成する。
            const user = {
                id: result.rows[0].id,
                profileId: result.rows[0].profile_id,
                authenticationProviderId: result.rows[0].authentication_provider_id,
                userName: result.rows[0].user_name,
                createdAt: result.rows[0].created_at,
            };
            return user;
        } catch (error) {
            throw error;
        } finally {
            client.release();
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
            const result = await client.query(query, values);

            // ユーザーが存在しない場合、nullを返す。
            if (result.rows.length === 0) return null;

            // ユーザー情報を生成する。
            const user = {
                id: result.rows[0].id,
                profileId: result.rows[0].profile_id,
                authenticationProviderId: result.rows[0].authentication_provider_id,
                userName: result.rows[0].user_name,
                createdAt: result.rows[0].created_at,
            };
            return user;
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }
}