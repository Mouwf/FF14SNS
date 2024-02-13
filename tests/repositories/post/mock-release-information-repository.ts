import ReleaseInformation from "../../../app/models/post/release-information";
import IReleaseInformationRepository from "../../../app/repositories/post/i-release-information-repository";

/**
 * モックのリリース情報リポジトリ。
 */
export default class MockReleaseInformationRepository implements IReleaseInformationRepository {
    /**
     * エラーを強制するかどうか。
     */
    private _isForceError: boolean = false;

    /**
     * エラーを強制するかどうか。
     */
    get isForceError(): boolean {
        return this._isForceError;
    }

    /**
     * エラーを強制するかどうか。
     */
    set isForceError(value: boolean) {
        this._isForceError = value;
    }

    public async get(releaseInformationId: number): Promise<ReleaseInformation> {
        if (releaseInformationId !== 1) throw new Error("Invalid release information id.");
        const releaseInformation = {
            id: 1,
            releaseVersion: "2.5",
            releaseName: "リリース2.5",
            createdAt: new Date(),
        }
        return releaseInformation;
    }

    public async getAll(): Promise<ReleaseInformation[]> {
        if (this.isForceError) throw new Error("Error occurred.");
        const allReleaseInformation = [
            {
                id: 1,
                releaseVersion: "2.1",
                releaseName: "リリース2.1",
                createdAt: new Date(),
            },
            {
                id: 2,
                releaseVersion: "2.2",
                releaseName: "リリース2.2",
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
                releaseVersion: "2.4",
                releaseName: "リリース2.4",
                createdAt: new Date(),
            },
            {
                id: 5,
                releaseVersion: "2.5",
                releaseName: "リリース2.5",
                createdAt: new Date(),
            },
        ];
        return allReleaseInformation;
    }

    public async getBelowUserSetting(profileId: string): Promise<ReleaseInformation[]> {
        if (this.isForceError) throw new Error("Error occurred.");
        if (profileId === "username_world1") {
            const allReleaseInformation = [
                {
                    id: 1,
                    releaseVersion: "2.1",
                    releaseName: "リリース2.1",
                    createdAt: new Date(),
                },
                {
                    id: 2,
                    releaseVersion: "2.2",
                    releaseName: "リリース2.2",
                    createdAt: new Date(),
                },
                {
                    id: 3,
                    releaseVersion: "2.3",
                    releaseName: "リリース2.3",
                    createdAt: new Date(),
                },
            ];
            return allReleaseInformation;
        }
        const allReleaseInformation = [
            {
                id: 1,
                releaseVersion: "2.1",
                releaseName: "リリース2.1",
                createdAt: new Date(),
            },
            {
                id: 2,
                releaseVersion: "2.2",
                releaseName: "リリース2.2",
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
                releaseVersion: "2.4",
                releaseName: "リリース2.4",
                createdAt: new Date(),
            },
            {
                id: 5,
                releaseVersion: "2.5",
                releaseName: "リリース2.5",
                createdAt: new Date(),
            },
        ];
        return allReleaseInformation;
    }
}