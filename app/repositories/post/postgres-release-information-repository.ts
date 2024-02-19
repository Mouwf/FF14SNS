import systemMessages from "../../messages/system-messages";
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

    public async get(releaseInformationId: number): Promise<ReleaseInformation> {
        const client = await this.postgresClientProvider.get();
        try {
            // リリース情報を取得する。
            const query = `
                SELECT * FROM release_information WHERE id = $1;
            `;
            const values = [releaseInformationId];
            const result = await client.query(query, values);

            // リリース情報が存在しない場合、エラーを投げる。
            if (result.rows.length === 0) throw new Error(`${systemMessages.error.releaseInformationRetrievalFailed}releaseInformationId=${releaseInformationId}`);

            // リリース情報を生成する。
            const releaseInformation = {
                id: result.rows[0].id,
                releaseVersion: result.rows[0].release_version,
                releaseName: result.rows[0].release_name,
                createdAt: result.rows[0].created_at,
            };
            return releaseInformation;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            client.release();
        }
    }

    public async getAll(): Promise<ReleaseInformation[]> {
        const client = await this.postgresClientProvider.get();
        try {
            // リリース情報を取得する。
            const query = `
                SELECT * FROM release_information;
            `;
            const result = await client.query(query);

            // リリース情報が存在しない場合、エラーを投げる。
            if (result.rows.length === 0) throw new Error(systemMessages.error.releaseInformationNotExists);

            // リリース情報を生成する。
            const allReleaseInformation = result.rows.map((releaseInformation) => {
                return {
                    id: releaseInformation.id,
                    releaseVersion: releaseInformation.release_version,
                    releaseName: releaseInformation.release_name,
                    createdAt: releaseInformation.created_at,
                };
            });
            return allReleaseInformation;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            client.release();
        }
    }

    public async getBelowUserSetting(profileId: string): Promise<ReleaseInformation[]> {
        const client = await this.postgresClientProvider.get();
        try {
            // リリースバージョンフィルター設定を取得する。
            const releaseVersionFilterSettingQuery = `
                SELECT release_information.release_version
                FROM release_version_filter_settings
                JOIN users ON release_version_filter_settings.user_id = users.id
                JOIN release_information ON release_version_filter_settings.release_information_id = release_information.id
                WHERE users.profile_id = $1;
            `;
            const releaseVersionFilterSettingValues = [profileId];
            const releaseVersionFilterSetting = await client.query(releaseVersionFilterSettingQuery, releaseVersionFilterSettingValues);

            // リリースバージョンフィルター設定が存在しない場合、空の配列を返す。
            if (releaseVersionFilterSetting.rowCount === 0) return [];

            // 設定されたリリースバージョン以下のリリース情報を取得する。
            const configuredReleaseVersion = releaseVersionFilterSetting.rows[0].release_version;
            const query = `
                SELECT
                    id,
                    release_version,
                    release_name
                FROM
                    release_information
                WHERE
                    string_to_array(release_version, '.')::integer[] <= string_to_array($1, '.')::integer[]
                ORDER BY
                    string_to_array(release_version, '.')::integer[] ASC;
            `;
            const values = [configuredReleaseVersion];
            const result = await client.query(query, values);

            // リリース情報を生成する。
            const releaseInformationBelowUserSetting = result.rows.map(releaseInformation => ({
                id: releaseInformation.id,
                releaseVersion: releaseInformation.release_version,
                releaseName: releaseInformation.release_name,
                createdAt: releaseInformation.created_at,
            }));
            return releaseInformationBelowUserSetting;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            client.release();
        }
    }
}