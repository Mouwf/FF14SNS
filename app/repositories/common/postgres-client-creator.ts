import pg from "pg";

/**
 * Posgresのクライアントを生成するクラス。
 */
export default class PostgresClientCreator {
    /**
     * Posgresのクライアントを生成する。
     * @returns Posgresのクライアント。
     */
    public static create(): pg.Client {
        const { Client } = pg;
        return new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });
    }
}