import ReleaseInformation from "../../models/post/release-information";

/**
 * リリース情報リポジトリ。
 */
export default interface IReleaseInformationRepository {
    /**
     * リリース情報を取得する。
     * @param releaseInformationId リリース情報ID。
     * @returns リリース情報。
     */
    get(releaseInformationId: number): Promise<ReleaseInformation>;

    /**
     * リリース情報を全件取得する。
     * @returns 全てのリリース情報。
     */
    getAll(): Promise<ReleaseInformation[]>;

    /**
     * ユーザーが設定したリリースバージョン以下のリリース情報を取得する。
     * @param profileId プロフィールID。
     * @returns ユーザーが設定したリリースバージョン以下のリリース情報。
     */
    getBelowUserSetting(profileId: string): Promise<ReleaseInformation[]>;
}