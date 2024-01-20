import { describe, test, expect, beforeEach } from "@jest/globals";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import PostgresReleaseInformationRepository from "../../../../app/repositories/post/postgres-release-information-repository";
import ReleaseInformationGetter from "../../../../app/libraries/post/release-information-getter";

/**
 * リリース情報を取得するクラス。
 */
let releaseInformationGetter: ReleaseInformationGetter;

beforeEach(() => {
    const postgresReleaseInformationRepository = new PostgresReleaseInformationRepository(postgresClientProvider);
    releaseInformationGetter = new ReleaseInformationGetter(postgresReleaseInformationRepository);
});

describe("getReleaseInformation", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("getReleaseInformation should return a release information.", async () => {
        // リリース情報を取得する。
        const releaseId = 1;
        const response = await releaseInformationGetter.getReleaseInformation(releaseId);

        // 結果を検証する。
        expect(response.id).toBeDefined();
        expect(response.releaseVersion).toBeDefined();
        expect(response.releaseName).toBeDefined();
    });
});

describe("getAllReleaseInformation", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("getAllReleaseInformation should return release informations.", async () => {
        // リリース情報を取得する。
        const response = await releaseInformationGetter.getAllReleaseInformation();

        // 結果を検証する。
        expect(response.length).toBeGreaterThan(0);
        expect(response[0].id).toBeDefined();
        expect(response[0].releaseVersion).toBeDefined();
        expect(response[0].releaseName).toBeDefined();
    });
});