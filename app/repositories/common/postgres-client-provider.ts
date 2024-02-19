import systemMessages from "../../messages/system-messages";
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
        if (process.env.RUN_INFRA_TESTS) {
            if (!process.env.TEST_DATABASE_URL) {
                throw new Error(systemMessages.error.databaseTestEnvironmentVariableError);
            }
            process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
        }
        if (!process.env.DATABASE_URL) {
            throw new Error(systemMessages.error.databaseEnvironmentVariableError);
        }
        this.pool = new pg.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });
        this.pool.on("error", (error, client) => {
            console.error(systemMessages.error.databasePoolError, error);
            client.release();
        });
    }

    /**
     * Postgresのクライアントを取得する。
     * @returns Postgresのクライアント。
     */
    public async get(): Promise<pg.PoolClient> {
        const client = await this.pool.connect();
        client.on("error", (error) => {
            console.error(systemMessages.error.databaseClientError, error);
        });
        return client;
    }
}