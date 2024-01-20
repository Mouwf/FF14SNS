import { describe, test, expect, beforeEach } from "@jest/globals";
import MockReleaseInformationRepository from "../../repositories/post/mock-release-information-repository";
import ReleaseInformationGetter from "../../../app/libraries/post/release-information-getter";
import ReleaseInformationLoader from "../../../app/loaders/post/release-information-loader";

/**
 * リリース情報を取得するローダー。
 */
let releaseInformationLoader: ReleaseInformationLoader;

beforeEach(() => {
    const mockReleaseInformationRepository = new MockReleaseInformationRepository();
    const releaseInformationGetter = new ReleaseInformationGetter(mockReleaseInformationRepository);
    releaseInformationLoader = new ReleaseInformationLoader(releaseInformationGetter);
});

describe("getReleaseInformation", () => {
    test("getReleaseInformation should return a release information.", async () => {
        // リリース情報を取得する。
        const releaseId = 1;
        const response = await releaseInformationLoader.getReleaseInformation(releaseId);

        // 結果を検証する。
        const expectedReleaseInformation = {
            id: 1,
            releaseVersion: "2.5",
            releaseName: "リリース2.5",
            createdAt: new Date(),
        }
        expect(response.id).toBe(expectedReleaseInformation.id);
        expect(response.releaseVersion).toBe(expectedReleaseInformation.releaseVersion);
        expect(response.releaseName).toBe(expectedReleaseInformation.releaseName);
        expect(response.createdAt).toBeInstanceOf(Date);
    });
});

describe("getAllReleaseInformation", () => {
    test("getAllReleaseInformation should return release informations.", async () => {
        // リリース情報を取得する。
        const response = await releaseInformationLoader.getAllReleaseInformation();

        // 結果を検証する。
        expect(response.length).toBe(5);
        expect(response[0].id).toBe(1);
        expect(response[0].releaseVersion).toBe("2.5");
        expect(response[0].releaseName).toBe("リリース2.5");
        expect(response[0].createdAt).toBeInstanceOf(Date);
        expect(response[1].id).toBe(2);
        expect(response[1].releaseVersion).toBe("2.4");
        expect(response[1].releaseName).toBe("リリース2.4");
        expect(response[1].createdAt).toBeInstanceOf(Date);
    });
});