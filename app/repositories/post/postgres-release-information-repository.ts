import PostgresClientProvider from "../common/postgres-client-provider";
import ReleaseInformation from "../../models/post/release-information";
import IReleaseInformationRepository from "./i-release-information-repository";

/**
 * Postgresのリリース情報リポジトリ。
 */
export default class PostgresReleaseInformationRepository implements IReleaseInformationRepository {
    /**
     * Postgresのリリース情報リポジトリを生成する。
     * @param postgresClientProvider Postgresクライアントプロバイダー。
     */
    constructor(
        private readonly postgresClientProvider: PostgresClientProvider,
    ) {
    }

    public async get(releaseId: string): Promise<ReleaseInformation> {
        const client = await this.postgresClientProvider.get();
        try {
            // リリース情報を取得する。
            const query = `
                SELECT * FROM release_information WHERE id = $1;
            `;
            const values = [releaseId];
            const result = await client(query, values);

            // リリース情報が存在しない場合、エラーを投げる。
            if (result.length === 0) throw new Error(`リリース情報が存在しません。releaseId=${releaseId}`);

            // リリース情報を生成する。
            const releaseInformation = {
                id: result[0].id,
                releaseVersion: result[0].release_version,
                releaseName: result[0].release_name,
                createdAt: result[0].created_at,
            };
            return releaseInformation;
        } catch (error) {
            throw error;
        }
    }

    public async getAll(): Promise<ReleaseInformation[]> {
        const client = await this.postgresClientProvider.get();
        try {
            // リリース情報を取得する。
            const query = `
                SELECT * FROM release_information;
            `;
            const result = await client(query);

            // リリース情報が存在しない場合、エラーを投げる。
            if (result.length === 0) throw new Error(`リリース情報が存在しません。`);

            // リリース情報を生成する。
            const allReleaseInformation = result.map((releaseInformation) => {
                return {
                    id: releaseInformation.id,
                    releaseVersion: releaseInformation.release_version,
                    releaseName: releaseInformation.release_name,
                    createdAt: releaseInformation.created_at,
                };
            });
            return allReleaseInformation;
        } catch (error) {
            throw error;
        }
    }
}