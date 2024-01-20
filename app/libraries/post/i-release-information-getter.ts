import ReleaseInformation from "../../models/post/release-information";

/**
 * リリース情報を取得するインターフェース。
 */
export default interface IReleaseInformationGetter {
    /**
     * リリース情報を取得する。
     * @param releaseId リリースID。
     */
    getReleaseInformation(releaseId: number): Promise<ReleaseInformation>;

    /**
     * リリース情報を全件取得する。
     */
    getAllReleaseInformation(): Promise<ReleaseInformation[]>;
}