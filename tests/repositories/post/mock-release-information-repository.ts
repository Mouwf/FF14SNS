import ReleaseInformation from "../../../app/models/post/release-information";
import IReleaseInformationRepository from "../../../app/repositories/post/i-release-information-repository";

/**
 * モックのリリース情報リポジトリ。
 */
export default class MockReleaseInformationRepository implements IReleaseInformationRepository {
    public async get(releaseInformationId: number): Promise<ReleaseInformation> {
        const releaseInformation = {
            id: 1,
            releaseVersion: "2.5",
            releaseName: "リリース2.5",
            createdAt: new Date(),
        }
        return releaseInformation;
    }

    public async getAll(): Promise<ReleaseInformation[]> {
        const allReleaseInformation = [
            {
                id: 1,
                releaseVersion: "2.5",
                releaseName: "リリース2.5",
                createdAt: new Date(),
            },
            {
                id: 2,
                releaseVersion: "2.4",
                releaseName: "リリース2.4",
                createdAt: new Date(),
            },
            {
                id: 3,
                releaseVersion: "2.3",
                releaseName: "リリース2.3",
                createdAt: new Date(),
            },
            {
                id: 4,
                releaseVersion: "2.2",
                releaseName: "リリース2.2",
                createdAt: new Date(),
            },
            {
                id: 5,
                releaseVersion: "2.1",
                releaseName: "リリース2.1",
                createdAt: new Date(),
            },
        ];
        return allReleaseInformation;
    }
}