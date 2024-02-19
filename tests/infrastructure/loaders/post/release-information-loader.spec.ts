import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import PostgresReleaseInformationRepository from "../../../../app/repositories/post/postgres-release-information-repository";
import ReleaseInformationGetter from "../../../../app/libraries/post/release-information-getter";
import ReleaseInformationLoader from "../../../../app/loaders/post/release-information-loader";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";

/**
 * リリース情報を取得するローダー。
 */
let releaseInformationLoader: ReleaseInformationLoader;

/**
 * Postgresのユーザーリポジトリ。
 */
let postgresUserRepository: PostgresUserRepository;

/**
 * プロフィールID。
 */
const profileId = "username_world";

/**
 * ユーザー名。
 */
const userName = "UserName@World";

/**
 * 現在のリリース情報ID。
 */
const currentReleaseInformationId = 4;

beforeEach(async () => {
    const postgresReleaseInformationRepository = new PostgresReleaseInformationRepository(postgresClientProvider);
    const releaseInformationGetter = new ReleaseInformationGetter(postgresReleaseInformationRepository);
    releaseInformationLoader = new ReleaseInformationLoader(releaseInformationGetter);
    postgresUserRepository = new PostgresUserRepository(postgresClientProvider);
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("getReleaseInformation", () => {
    test("getReleaseInformation should return a release information.", async () => {
        // リリース情報を取得する。
        const releaseInformationId = 1;
        const response = await releaseInformationLoader.getReleaseInformation(releaseInformationId);

        // 結果を検証する。
        expect(response.id).toBeDefined();
        expect(response.releaseVersion).toBeDefined();
        expect(response.releaseName).toBeDefined();
    });
});

describe("getAllReleaseInformation", () => {
    test("getAllReleaseInformation should return release informations.", async () => {
        // リリース情報を取得する。
        const response = await releaseInformationLoader.getAllReleaseInformation();

        // 結果を検証する。
        expect(response.length).toBeGreaterThan(0);
        expect(response[0].id).toBeDefined();
        expect(response[0].releaseVersion).toBeDefined();
        expect(response[0].releaseName).toBeDefined();
    });
});

describe("getReleaseInformationBelowUserSetting", () => {
    test("getReleaseInformationBelowUserSetting should return release informations.", async () => {
        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = "authenticationProviderId";
        await postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId);

        // リリース情報を取得する。
        const response = await releaseInformationLoader.getReleaseInformationBelowUserSetting(profileId);

        // 結果を検証する。
        expect(response.length).toBe(currentReleaseInformationId);
    });
});