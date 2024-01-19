import pg from "pg";

/**
 * Postgresのクライアントを生成するクラス。
 */
export default class PostgresClientProvider {
    /**
     * Posgresのプール。
     */
    private readonly pool: pg.Pool;

    /**
     * Postgresのクライアントを生成する。
     */
    constructor() {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URLが設定されていません。');
        }

        this.pool = new pg.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });

        this.pool.on('error', (error) => {
            console.error('Postgres pool error', error);
        });
    }

    /**
     * Postgresのクライアントを取得する。
     * @returns Posgresのクライアント。
     */
    public async get(): Promise<pg.PoolClient> {
        return await this.pool.connect();
    }
}