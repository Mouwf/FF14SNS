import systemMessages from "../../messages/system-messages";
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
     * @returns リリース情報。
     */
    public async getReleaseInformation(releaseInformationId: number): Promise<ReleaseInformation> {
        try {
            const response = await this.releaseInformationRepository.get(releaseInformationId);
            return response;
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.releaseInformationRetrievalFailed);
        }
    }

    /**
     * リリース情報を全件取得する。
     * @returns 全てのリリース情報。
     */
    public async getAllReleaseInformation(): Promise<ReleaseInformation[]> {
        try {
            const response = await this.releaseInformationRepository.getAll();
            return response;
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.releaseInformationRetrievalFailed);
        }
    }

    /**
     * ユーザーが設定したリリースバージョン以下のリリース情報を取得する。
     * @param profileId プロフィールID。
     * @returns ユーザーが設定したリリースバージョン以下のリリース情報。
     */
    public async getReleaseInformationBelowUserSetting(profileId: string): Promise<ReleaseInformation[]> {
        try {
            const response = await this.releaseInformationRepository.getBelowUserSetting(profileId);
            return response;
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.releaseInformationRetrievalFailed);
        }
    }
}