import systemMessages from "../../messages/system-messages";
import PostgresClientProvider from "../common/postgres-client-provider";
import User from "../../models/user/user";
import UserSetting from "../../models/user/user-setting";
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

    public async create(profileId: string, authenticationProviderId: string, userName: string, currentReleaseInformationId: number): Promise<boolean> {
        const client = await this.postgresClientProvider.get();
        try {
            await client.query("BEGIN");

            // ユーザーを作成する。
            const userInsertQuery = `
                INSERT INTO users (
                    profile_id,
                    authentication_provider_id,
                    user_name
                )
                VALUES (
                    $1,
                    $2,
                    $3
                )
                RETURNING id;
            `;
            const userInsertValues = [profileId, authenticationProviderId, userName];
            const userInsertResult = await client.query(userInsertQuery, userInsertValues);

            // 結果がない場合、falseを返す。
            if (userInsertResult.rowCount === 0) {
                console.error(systemMessages.error.userRegistrationFailed);
                await client.query("ROLLBACK");
                return false;
            }

            // リリースバージョンフィルターの設定を作成する。
            const userId = userInsertResult.rows[0].id;
            const releaseVersionFilterSettingInsertQuery = `
                INSERT INTO release_version_filter_settings (
                    user_id,
                    release_information_id
                )
                VALUES (
                    $1,
                    $2
                );
            `;
            const releaseVersionFilterSettingInsertValues = [userId, currentReleaseInformationId];
            const releaseVersionFilterSettingInsertResult = await client.query(releaseVersionFilterSettingInsertQuery, releaseVersionFilterSettingInsertValues);

            // 結果がない場合、falseを返す。
            if (releaseVersionFilterSettingInsertResult.rowCount === 0) {
                console.error(systemMessages.error.userSettingRegistrationFailed);
                await client.query("ROLLBACK");
                return false;
            }

            // コミットする。
            await client.query("COMMIT");
            return true;
        } catch (error) {
            console.error(error);
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    public async update(userSetting: UserSetting): Promise<boolean> {
        const client = await this.postgresClientProvider.get();
        try {
            await client.query("BEGIN");

            // ユーザーIDを取得する。
            const getUserIdQuery = `
                SELECT id FROM users
                WHERE profile_id = $1;
            `;
            const getUserIdValues = [userSetting.userId];
            const getUserResult = await client.query(getUserIdQuery, getUserIdValues);

            // ユーザーが存在しない場合、エラーを投げる。
            if (getUserResult.rowCount === 0) throw new Error(systemMessages.error.userNotExists);

            // リリースバージョンフィルターの設定が存在するかを確認する。
            const userId = getUserResult.rows[0].id;
            const checkReleaseVersionFilterSettingQuery = `
                SELECT 1 FROM release_version_filter_settings
                WHERE user_id = $1;
            `;
            const checkReleaseVersionFilterSettingValues = [userId];
            const checkReleaseVersionFilterSettingResult = await client.query(checkReleaseVersionFilterSettingQuery, checkReleaseVersionFilterSettingValues);

            // リリースバージョンフィルターの設定を行う。
            let query: string;
            if (checkReleaseVersionFilterSettingResult.rowCount === 0) {
                query = `
                    INSERT INTO release_version_filter_settings (
                        user_id,
                        release_information_id
                    )
                    VALUES (
                        $1,
                        $2
                    );
                `;
            } else {
                query = `
                    UPDATE release_version_filter_settings
                    SET release_information_id = $2
                    WHERE user_id = $1;
                `;
            }
            const values = [userId, userSetting.currentReleaseInformationId];
            const result = await client.query(query, values);

            // 結果がない場合、falseを返す。
            if (result.rowCount === 0) {
                console.error(systemMessages.error.userSettingEditFailed);
                await client.query("ROLLBACK");
                return false;
            }

            // コミットする。
            await client.query("COMMIT");
            return true;
        } catch (error) {
            console.error(error);
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    public async delete(id: number): Promise<boolean> {
        const client = await this.postgresClientProvider.get();
        try {
            await client.query("BEGIN");

            // リリースバージョンフィルターの設定を削除する。
            const deleteSettingsQuery = `
                DELETE FROM release_version_filter_settings WHERE user_id = $1;
            `;
            const deleteSettingsValues = [id];
            const deleteSettingsResult = await client.query(deleteSettingsQuery, deleteSettingsValues);

            // 結果がない場合、falseを返す。
            if (deleteSettingsResult.rowCount === 0) {
                console.error(systemMessages.error.userSettingDeletionFailed);
                await client.query("ROLLBACK");
                return false;
            }

            // ユーザーを削除する。
            const deleteUserQuery = `
                DELETE FROM users WHERE id = $1;
            `;
            const deleteUserValues = [id];
            const deleteUserResult = await client.query(deleteUserQuery, deleteUserValues);

            // 結果がない場合、falseを返す。
            if (deleteUserResult.rowCount === 0) {
                console.error(systemMessages.error.userDeletionFailed);
                await client.query("ROLLBACK");
                return false;
            }

            // コミットする。
            await client.query("COMMIT");
            return true;
        } catch (error) {
            console.error(error);
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    public async existsByProfileId(profileId: string): Promise<boolean> {
        const client = await this.postgresClientProvider.get();
        try {
            // ユーザーが存在するかを取得する。
            const query = `
                SELECT 1 FROM users WHERE profile_id = $1 LIMIT 1;
            `;
            const values = [profileId];
            const result = await client.query(query, values);

            // ユーザーが存在するかどうかを返す。
            return result.rows.length > 0;
        } catch (error) {
            console.error(error);
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
                SELECT
                    users.id,
                    users.profile_id,
                    users.authentication_provider_id,
                    users.user_name,
                    users.created_at,
                    release_information.release_version AS current_release_version,
                    release_information.release_name AS current_release_name
                FROM
                    users
                LEFT JOIN release_version_filter_settings ON users.id = release_version_filter_settings.user_id
                LEFT JOIN release_information ON release_version_filter_settings.release_information_id = release_information.id
                WHERE
                    users.profile_id = $1;
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
                currentReleaseVersion: result.rows[0].current_release_version || "",
                currentReleaseName: result.rows[0].current_release_name || "",
                createdAt: result.rows[0].created_at,
            };
            return user;
        } catch (error) {
            console.error(error);
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
                SELECT
                    users.id,
                    users.profile_id,
                    users.authentication_provider_id,
                    users.user_name,
                    users.created_at,
                    release_information.release_version AS currentReleaseVersion,
                    release_information.release_name AS currentReleaseName
                FROM
                    users
                LEFT JOIN release_version_filter_settings ON users.id = release_version_filter_settings.user_id
                LEFT JOIN release_information ON release_version_filter_settings.release_information_id = release_information.id
                WHERE
                    users.authentication_provider_id = $1;
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
                currentReleaseVersion: result.rows[0].currentReleaseVersion || "",
                currentReleaseName: result.rows[0].currentReleaseName || "",
                createdAt: result.rows[0].created_at,
            };
            return user;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            client.release();
        }
    }

    public async findUserSettingByProfileId(profileId: string): Promise<UserSetting | null> {
        const client = await this.postgresClientProvider.get();
        try {
            // ユーザー設定を取得する。
            const query = `
                SELECT
                    users.profile_id,
                    users.user_name,
                    release_version_filter_settings.release_information_id
                FROM
                    users
                LEFT JOIN release_version_filter_settings ON users.id = release_version_filter_settings.user_id
                WHERE
                    users.profile_id = $1;
            `;
            const values = [profileId];
            const result = await client.query(query, values);

            // ユーザー設定が存在しない場合、nullを返す。
            if (result.rowCount === 0) return null;

            // ユーザー設定を生成する。
            const userSetting = {
                userId: result.rows[0].profile_id,
                userName: result.rows[0].user_name,
                currentReleaseInformationId: result.rows[0].release_information_id || 1,
            };
            return userSetting;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            client.release();
        }
    }
}