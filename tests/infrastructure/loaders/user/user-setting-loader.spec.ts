import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import UserProfileManager from "../../../../app/libraries/user/user-profile-manager";
import UserSettingLoader from "../../../../app/loaders/user/user-setting-loader";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";

/**
 * ユーザー設定を行うアクション。
 */
let userSettingLoader: UserSettingLoader;

/**
 * Postgresのユーザーリポジトリ。
 */
let postgresUserRepository: PostgresUserRepository;

/**
 * プロフィールID。
 */
const profileId = "username_world";

/**
 * 認証プロバイダーID。
 */
const authenticationProviderId = "test_authentication_provider_id";

/**
 * ユーザー名。
 */
const userName = "UserName@World";

/**
 * 現在のリリース情報ID。
 */
const currentReleaseInformationId = 1;

beforeEach(async () => {
    postgresUserRepository = new PostgresUserRepository(postgresClientProvider);
    const userProfileManager = new UserProfileManager(postgresUserRepository);
    userSettingLoader = new UserSettingLoader(userProfileManager);
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("fetchUserSettingByProfileId", () => {
    test("fetchUserSettingByProfileId should fetch user setting by profileId", async () => {
        // テスト用のユーザー情報を作成する。
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // ユーザー設定を取得する。
        const response = await delayAsync(() => userSettingLoader.fetchUserSettingByProfileId(profileId));

        // 結果を検証する。
        expect(response.userId).toBe(profileId);
        expect(response.userName).toBe(userName);
        expect(response.currentReleaseInformationId).toBe(currentReleaseInformationId);
    });
});