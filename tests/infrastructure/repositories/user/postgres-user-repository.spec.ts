import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";

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
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("create", () => {
    test("create should create a new user", async () => {
        // テスト用のユーザー情報を作成する。
        const response = await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // ユーザー設定を取得する。
        const responseFindUserSettingByProfileId = await delayAsync(() => postgresUserRepository.findUserSettingByProfileId(profileId));

        // ユーザー設定が存在しない場合、エラーを投げる。
        if (responseFindUserSettingByProfileId == null) throw new Error("The user setting does not exist.");

        // 結果を検証する。
        expect(response).toBe(true);
        expect(responseFindUserSettingByProfileId.userId).toBe(profileId);
        expect(responseFindUserSettingByProfileId.userName).toBe(userName);
        expect(responseFindUserSettingByProfileId.currentReleaseInformationId).toBe(currentReleaseInformationId);
    });
});

describe("update", () => {
    test("update should update a user", async () => {
        // テスト用のユーザー情報を作成する。
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // 認証済みユーザーを取得する。
        const responseAuthenticatedUser = await delayAsync(() => postgresUserRepository.findByProfileId(profileId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseAuthenticatedUser === null) throw new Error("The user does not exist.");

        // ユーザー設定を取得する。
        const responseFindUserSettingByProfileId = await delayAsync(() => postgresUserRepository.findUserSettingByProfileId(profileId));

        // ユーザー設定が存在しない場合、エラーを投げる。
        if (responseFindUserSettingByProfileId === null) throw new Error("The user setting does not exist.");

        // ユーザー設定を更新する。
        const newUserSetting = {
            ...responseFindUserSettingByProfileId,
            currentReleaseInformationId: 2,
        };
        const response = await delayAsync(() => postgresUserRepository.update(newUserSetting));

        // 更新したユーザー設定を取得する。
        const responseUpdatedFindUserSettingByProfileId = await delayAsync(() => postgresUserRepository.findUserSettingByProfileId(profileId));

        // 更新したユーザー設定が存在しない場合、エラーを投げる。
        if (responseUpdatedFindUserSettingByProfileId === null) throw new Error("The updated user setting does not exist.");

        // 結果を検証する。
        expect(response).toBe(true);
        expect(responseUpdatedFindUserSettingByProfileId.currentReleaseInformationId).toBe(2);
    });
});

describe("delete", () => {
    test("delete should delete a user", async () => {
        // テスト用のユーザー情報を作成する。
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // テスト用のユーザー情報を取得する。
        const responseFindByProfileId = await delayAsync(() => postgresUserRepository.findByProfileId(profileId));

        // テスト用のユーザー情報が存在しない場合、エラーを投げる。
        if (responseFindByProfileId == null) throw new Error("The user does not exist.");

        // テスト用のユーザー情報を削除する。
        const id = responseFindByProfileId.id;
        const responseDelete = await delayAsync(() => postgresUserRepository.delete(id));
        const responseFindByProfileIdAfterDelete = await delayAsync(() => postgresUserRepository.findByProfileId(profileId));

        // 結果を検証する。
        expect(responseDelete).toBe(true);
        expect(responseFindByProfileIdAfterDelete).toBeNull();
    });
});

describe("findByProfileId", () => {
    test("findByProfileId should return a user", async () => {
        // テスト用のユーザー情報を作成する。
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // テスト用のユーザー情報を取得する。
        const response = await delayAsync(() => postgresUserRepository.findByProfileId(profileId));

        // ユーザー情報が取得できない場合、エラーを投げる。
        if (response == null) throw new Error("The user does not exist.");

        // 結果を検証する。
        expect(response.id).toBeDefined();
        expect(response.profileId).toBe(profileId);
        expect(response.authenticationProviderId).toBe(authenticationProviderId);
        expect(response.userName).toBe(userName);
        expect(response.currentReleaseVersion).toBeDefined();
        expect(response.currentReleaseName).toBeDefined();
        expect(response.createdAt).toBeInstanceOf(Date);
    });

    test("findByProfileId should return null for a user that does not exist", async () => {
        // テスト用のユーザー情報を取得する。
        const response = await delayAsync(() => postgresUserRepository.findByProfileId(profileId));

        // 結果を検証する。
        expect(response).toBeNull();
    });
});

describe("findByAuthenticationProviderId", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("findByAuthenticationProviderId should return a user", async () => {
        // テスト用のユーザー情報を作成する。
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // テスト用のユーザー情報を取得する。
        const response = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // ユーザー情報が取得できない場合、エラーを投げる。
        if (response == null) throw new Error("The user does not exist.");

        // 結果を検証する。
        expect(response.id).toBeDefined();
        expect(response.profileId).toBe(profileId);
        expect(response.authenticationProviderId).toBe(authenticationProviderId);
        expect(response.userName).toBe(userName);
        expect(response.currentReleaseVersion).toBeDefined();
        expect(response.currentReleaseName).toBeDefined();
        expect(response.createdAt).toBeInstanceOf(Date);
    });

    test("findByAuthenticationProviderId should return null for a user that does not exist", async () => {
        // テスト用のユーザー情報を取得する。
        const response = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // 結果を検証する。
        expect(response).toBeNull();
    });
});

describe("findUserSettingByProfileId", () => {
    test("findUserSettingByProfileId should return a user setting", async () => {
        // テスト用のユーザー情報を作成する。
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // テスト用のユーザー設定を取得する。
        const response = await delayAsync(() => postgresUserRepository.findUserSettingByProfileId(profileId));

        // ユーザー設定が取得できない場合、エラーを投げる。
        if (response == null) throw new Error("The user setting does not exist.");

        // 結果を検証する。
        expect(response.userId).toBe(profileId);
        expect(response.userName).toBe(userName);
        expect(response.currentReleaseInformationId).toBe(currentReleaseInformationId);
    });

    test("findUserSettingByProfileId should return null for a user setting that does not exist", async () => {
        // テスト用のユーザー設定を取得する。
        const response = await delayAsync(() => postgresUserRepository.findUserSettingByProfileId(profileId));

        // 結果を検証する。
        expect(response).toBeNull();
    });
});