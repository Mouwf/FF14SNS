import ReleaseInformation from "../../models/post/release-information";
import IReleaseInformationRepository from "../../repositories/post/i-release-information-repository";
import IReleaseInformationGetter from "./i-release-information-getter";

/**
 * リリース情報を取得するクラス。
 */
export default class ReleaseInformationGetter implements IReleaseInformationGetter {
    /**
     * リリース情報を取得するクラスを生成する。
     */
    constructor(
        private readonly releaseInformationRepository: IReleaseInformationRepository,
    ) {
    }

    public async getReleaseInformation(releaseId: number): Promise<ReleaseInformation> {
        const response = await this.releaseInformationRepository.get(releaseId);
        return response;
    }

    public async getAllReleaseInformation(): Promise<ReleaseInformation[]> {
        const response = await this.releaseInformationRepository.getAll();
        return response;
    }
}