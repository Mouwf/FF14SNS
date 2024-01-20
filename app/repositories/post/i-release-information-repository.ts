import ReleaseInformation from "../../models/post/release-information";

/**
 * リリース情報リポジトリ。
 */
export default interface IReleaseInformationRepository {
    /**
     * リリース情報を取得する。
     * @param releaseId リリースID。
     */
    get(releaseId: number): Promise<ReleaseInformation>;

    /**
     * リリース情報を全件取得する。
     */
    getAll(): Promise<ReleaseInformation[]>;
}