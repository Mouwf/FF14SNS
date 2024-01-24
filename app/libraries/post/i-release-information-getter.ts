import ReleaseInformation from "../../models/post/release-information";

/**
 * リリース情報を取得するインターフェース。
 */
export default interface IReleaseInformationGetter {
    /**
     * リリース情報を取得する。
     * @param releaseInformationId リリース情報ID。
     */
    getReleaseInformation(releaseInformationId: number): Promise<ReleaseInformation>;

    /**
     * リリース情報を全件取得する。
     */
    getAllReleaseInformation(): Promise<ReleaseInformation[]>;
}