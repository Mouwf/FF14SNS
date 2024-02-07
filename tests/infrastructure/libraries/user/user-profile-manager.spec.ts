import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import UserProfileManager from "../../../../app/libraries/user/user-profile-manager";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";

/**
 * Postgresのユーザーリポジトリ。
 */
let postgresUserRepository: PostgresUserRepository;

/**
 * ユーザーの登録を行うクラス。
 */
let userProfileManager: UserProfileManager;

/**
 * 認証プロバイダーID。
 */
const authenticationProviderId = "test_authentication_provider_id";

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
const currentReleaseInformationId = 1;

beforeEach(async () => {
    postgresUserRepository = new PostgresUserRepository(postgresClientProvider);
    userProfileManager = new UserProfileManager(postgresUserRepository);
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("register", () => {
    test("register should register a new user", async () => {
        // テスト用のユーザー情報を作成する。
        const response = await delayAsync(() => userProfileManager.register(authenticationProviderId, userName, currentReleaseInformationId));

        // 結果を検証する。
        expect(response).toBe(true);
    });

    test("register should throw an error when the authenticationProviderId is empty", async () => {
        expect.assertions(1);
        try {
            // テスト用のユーザー情報を作成する。
            await delayAsync(() => userProfileManager.register("", userName, currentReleaseInformationId));
        } catch (error) {
            // エラーがResponseでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe("認証プロバイダIDは必須です。");
        }
    });

    test("register should throw an error when the userName is empty", async () => {
        expect.assertions(1);
        try {
            // テスト用のユーザー情報を作成する。
            await delayAsync(() => userProfileManager.register(authenticationProviderId, "", currentReleaseInformationId));
        } catch (error) {
            // エラーがResponseでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe("ユーザー名は「username@world」で入力してください。");
        }
    });

    test("register should throw an error when the userName is invalid", async () => {
        expect.assertions(1);
        try {
            // テスト用のユーザー情報を作成する。
            await delayAsync(() => userProfileManager.register(authenticationProviderId, "invalidUserName", currentReleaseInformationId));
        } catch (error) {
            // エラーがResponseでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe("ユーザー名は「username@world」で入力してください。");
        }
    });
});

describe("editUserSetting", () => {
    test("editUserSetting should edit user setting", async () => {
        // テスト用のユーザー情報を作成する。
        await delayAsync(() => userProfileManager.register(authenticationProviderId, userName, currentReleaseInformationId));

        // 認証済みユーザーを取得する。
        const responseAuthenticatedUser = await delayAsync(() => postgresUserRepository.findByProfileId(profileId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseAuthenticatedUser === null) throw new Error("The user does not exist.");

        // ユーザー設定を取得する。
        const responseFindUserSettingByProfileId = await delayAsync(() => postgresUserRepository.findUserSettingByProfileId(profileId));

        // ユーザー設定が存在しない場合、エラーを投げる。
        if (responseFindUserSettingByProfileId === null) throw new Error("The user setting does not exist.");

        // ユーザー設定を更新する。
        const response = await delayAsync(() => userProfileManager.editUserSetting(responseFindUserSettingByProfileId));

        // 結果を検証する。
        expect(response).toBe(true);
    });
});

describe("delete", () => {
    test("delete should delete a user", async () => {
        // テスト用のユーザー情報を作成する。
        await delayAsync(() => userProfileManager.register(authenticationProviderId, userName, currentReleaseInformationId));

        // テスト用のユーザー情報を取得する。
        const responseFindByProfileId = await delayAsync(() => postgresUserRepository.findByProfileId(profileId));

        // テスト用のユーザー情報が存在しない場合、エラーを投げる。
        if (responseFindByProfileId == null) throw new Error("The user does not exist.");

        // テスト用のユーザー情報を削除する。
        const id = responseFindByProfileId.id;
        const responseDelete = await delayAsync(() => userProfileManager.delete(id));

        // 結果を検証する。
        expect(responseDelete).toBe(true);
    });
});

describe("fetchUserSettingByProfileId", () => {
    test("fetchUserSettingByProfileId should fetch user setting by profile id", async () => {
        // テスト用のユーザー情報を作成する。
        await delayAsync(() => userProfileManager.register(authenticationProviderId, userName, currentReleaseInformationId));

        // ユーザー設定を取得する。
        const response = await delayAsync(() => userProfileManager.fetchUserSettingByProfileId(profileId));

        // 結果を検証する。
        expect(response.userId).toBe(profileId);
        expect(response.userName).toBe(userName);
        expect(response.currentReleaseInformationId).toBe(currentReleaseInformationId);
    });
});