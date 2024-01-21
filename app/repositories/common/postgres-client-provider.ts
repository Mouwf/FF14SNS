import { neon, NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Postgresのクライアントを生成するクラス。
 */
export default class PostgresClientProvider {
    /**
     * Postgresのクライアント。
     */
    private readonly client: NeonQueryFunction<false, false>;

    /**
     * Postgresのクライアントを生成する。
     */
    constructor() {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URLが設定されていません。");
        }
        this.client = neon(process.env.DATABASE_URL);
    }

    /**
     * Postgresのクライアントを取得する。
     * @returns Postgresのクライアント。
     */
    public async get(): Promise<NeonQueryFunction<false, false>> {
        return await this.client;
    }
}