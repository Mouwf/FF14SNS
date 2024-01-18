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
        // 環境変数が設定されていない場合、エラーを投げる。
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URLが設定されていません。");
        }

        // Posgresのクライアントを生成する。
        const { Client } = pg;
        return new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });
    }
}