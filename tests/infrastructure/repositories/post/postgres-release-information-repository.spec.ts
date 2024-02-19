import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import PostgresReleaseInformationRepository from "../../../../app/repositories/post/postgres-release-information-repository";

/**
 * Postgresのリリース情報リポジトリ。
 */
let postgresReleaseInformationRepository: PostgresReleaseInformationRepository;

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
    postgresReleaseInformationRepository = new PostgresReleaseInformationRepository(postgresClientProvider);
    postgresUserRepository = new PostgresUserRepository(postgresClientProvider);
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("get", () => {
    test("get should return release information", async () => {
        // リリース情報を取得する。
        const releaseInformationId = 1;
        const response = await postgresReleaseInformationRepository.get(releaseInformationId);

        // 結果を検証する。
        expect(response.id).toBeDefined();
        expect(response.releaseVersion).toBeDefined();
        expect(response.releaseName).toBeDefined();
    });
});

describe("getAll", () => {
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

describe("getBelowUserSetting", () => {
    test("getBelowUserSetting should return release informations", async () => {
        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = "authenticationProviderId";
        await postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId);

        // リリース情報を取得する。
        const response = await postgresReleaseInformationRepository.getBelowUserSetting(profileId);

        // 結果を検証する。
        expect(response.length).toBe(currentReleaseInformationId);
    });
});