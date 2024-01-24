import { describe, test, expect, beforeEach } from "@jest/globals";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import PostgresReleaseInformationRepository from "../../../../app/repositories/post/postgres-release-information-repository";

/**
 * Postgresのリリース情報リポジトリ。
 */
let postgresReleaseInformationRepository: PostgresReleaseInformationRepository;

beforeEach(() => {
    postgresReleaseInformationRepository = new PostgresReleaseInformationRepository(postgresClientProvider);
});

describe("get", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("get should return release information", async () => {
        // リリース情報を取得する。
        const releaseInformationId = 1;
        const response = await postgresReleaseInformationRepository.get(releaseInformationId);

        // 結果を検証する。
        expect(response.id).toBeDefined();
        expect(response.releaseVersion).toBeDefined();
        expect(response.releaseName).toBeDefined();
    });

    test("get should throw an error if release information does not exist", async () => {
        expect.assertions(1);
        try {
            // リリース情報を取得する。
            const releaseInformationId = 100;
            await postgresReleaseInformationRepository.get(releaseInformationId);
        } catch (error) {
            // エラーがResponseでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe("リリース情報が存在しません。releaseInformationId=100");
        }
    });
});

describe("getAll", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("getAll should return release informations", async () => {
        // リリース情報を取得する。
        const response = await postgresReleaseInformationRepository.getAll();

        // 結果を検証する。
        expect(response.length).toBeGreaterThan(0);
        expect(response[0].id).toBeDefined();
        expect(response[0].releaseVersion).toBeDefined();
        expect(response[0].releaseName).toBeDefined();
    });
});