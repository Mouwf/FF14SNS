import ReleaseInformation from "../../models/post/release-information";
import IReleaseInformationRepository from "../../repositories/post/i-release-information-repository";

/**
 * リリース情報を取得するクラス。
 */
export default class ReleaseInformationGetter {
    /**
     * リリース情報を取得するクラスを生成する。
     */
    constructor(
        private readonly releaseInformationRepository: IReleaseInformationRepository,
    ) {
    }

    /**
     * リリース情報を取得する。
     * @param releaseInformationId リリース情報ID。
     */
    public async getReleaseInformation(releaseInformationId: number): Promise<ReleaseInformation> {
        const response = await this.releaseInformationRepository.get(releaseInformationId);
        return response;
    }

    /**
     * リリース情報を全件取得する。
     */
    public async getAllReleaseInformation(): Promise<ReleaseInformation[]> {
        const response = await this.releaseInformationRepository.getAll();
        return response;
    }

    /**
     * ユーザーが設定したリリースバージョン以下のリリース情報を取得する。
     * @param profileId プロフィールID。
     * @returns ユーザーが設定したリリースバージョン以下のリリース情報。
     */
    public async getReleaseInformationBelowUserSetting(profileId: string): Promise<ReleaseInformation[]> {
        const response = await this.releaseInformationRepository.getBelowUserSetting(profileId);
        return response;
    }
}