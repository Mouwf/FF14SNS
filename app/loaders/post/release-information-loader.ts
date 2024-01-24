import IReleaseInformationGetter from "../../libraries/post/i-release-information-getter";
import ReleaseInformation from "../../models/post/release-information";

/**
 * リリース情報を取得するローダー。
 */
export default class ReleaseInformationLoader {
    /**
     * リリース情報を取得するローダーを生成する。
     * @param releaseInformationGetter リリース情報を取得するクラス。
     */
    constructor(
        private readonly releaseInformationGetter: IReleaseInformationGetter
    ) {
    }

    /**
     * リリース情報を取得する。
     * @param releaseInformationId リリース情報ID。
     * @returns リリース情報。
     */
    public async getReleaseInformation(releaseInformationId: number): Promise<ReleaseInformation> {
        const releaseInformation = await this.releaseInformationGetter.getReleaseInformation(releaseInformationId);
        return releaseInformation;
    }

    /**
     * リリース情報を全件取得する。
     * @returns リリース情報。
     */
    public async getAllReleaseInformation(): Promise<ReleaseInformation[]> {
        const allReleaseInformation = await this.releaseInformationGetter.getAllReleaseInformation();
        return allReleaseInformation;
    }
}