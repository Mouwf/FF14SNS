import { describe, test, expect, beforeEach } from "@jest/globals";
import MockReleaseInformationRepository from "../../repositories/post/mock-release-information-repository";
import ReleaseInformationGetter from "../../../app/libraries/post/release-information-getter";

/**
 * リリース情報を取得するクラス。
 */
let releaseInformationGetter: ReleaseInformationGetter;

beforeEach(() => {
    const mockReleaseInformationRepository = new MockReleaseInformationRepository();
    releaseInformationGetter = new ReleaseInformationGetter(mockReleaseInformationRepository);
});

describe("getReleaseInformation", () => {
    test("getReleaseInformation should return a release information.", async () => {
        // リリース情報を取得する。
        const releaseInformationId = 1;
        const response = await releaseInformationGetter.getReleaseInformation(releaseInformationId);

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
        const response = await releaseInformationGetter.getAllReleaseInformation();

        // 結果を検証する。
        expect(response.length).toBe(5);
        expect(response[0].id).toBe(1);
        expect(response[0].releaseVersion).toBe("2.1");
        expect(response[0].releaseName).toBe("リリース2.1");
        expect(response[0].createdAt).toBeInstanceOf(Date);
        expect(response[1].id).toBe(2);
        expect(response[1].releaseVersion).toBe("2.2");
        expect(response[1].releaseName).toBe("リリース2.2");
        expect(response[1].createdAt).toBeInstanceOf(Date);
    });
});

describe("getReleaseInformationBelowUserSetting", () => {
    test("getReleaseInformationBelowUserSetting should return 3 release informations when profile id is username_world1.", async () => {
        // リリース情報を取得する。
        const profileId = "username_world1";
        const response = await releaseInformationGetter.getReleaseInformationBelowUserSetting(profileId);

        // 結果を検証する。
        expect(response.length).toBe(3);
        expect(response[0].id).toBe(1);
        expect(response[0].releaseVersion).toBe("2.1");
        expect(response[0].releaseName).toBe("リリース2.1");
        expect(response[0].createdAt).toBeInstanceOf(Date);
        expect(response[1].id).toBe(2);
        expect(response[1].releaseVersion).toBe("2.2");
        expect(response[1].releaseName).toBe("リリース2.2");
        expect(response[1].createdAt).toBeInstanceOf(Date);
        expect(response[2].id).toBe(3);
        expect(response[2].releaseVersion).toBe("2.3");
        expect(response[2].releaseName).toBe("リリース2.3");
        expect(response[2].createdAt).toBeInstanceOf(Date);
    });

    test("getReleaseInformationBelowUserSetting should return 5 release informations when profile id is username_world2.", async () => {
        // リリース情報を取得する。
        const profileId = "username_world2";
        const response = await releaseInformationGetter.getReleaseInformationBelowUserSetting(profileId);

        // 結果を検証する。
        expect(response.length).toBe(5);
        expect(response[0].id).toBe(1);
        expect(response[0].releaseVersion).toBe("2.1");
        expect(response[0].releaseName).toBe("リリース2.1");
        expect(response[0].createdAt).toBeInstanceOf(Date);
        expect(response[1].id).toBe(2);
        expect(response[1].releaseVersion).toBe("2.2");
        expect(response[1].releaseName).toBe("リリース2.2");
        expect(response[1].createdAt).toBeInstanceOf(Date);
        expect(response[2].id).toBe(3);
        expect(response[2].releaseVersion).toBe("2.3");
        expect(response[2].releaseName).toBe("リリース2.3");
        expect(response[2].createdAt).toBeInstanceOf(Date);
        expect(response[3].id).toBe(4);
        expect(response[3].releaseVersion).toBe("2.4");
        expect(response[3].releaseName).toBe("リリース2.4");
        expect(response[3].createdAt).toBeInstanceOf(Date);
        expect(response[4].id).toBe(5);
        expect(response[4].releaseVersion).toBe("2.5");
        expect(response[4].releaseName).toBe("リリース2.5");
        expect(response[4].createdAt).toBeInstanceOf(Date);
    });
});