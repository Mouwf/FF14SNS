import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import UserProfileManager from "../../../../app/libraries/user/user-profile-manager";
import UserSettingAction from "../../../../app/actions/user/user-setting-action";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";

/**
 * Postgresのユーザーリポジトリ。
 */
let postgresUserRepository: PostgresUserRepository;

/**
 * ユーザー設定を行うアクション。
 */
let userSettingAction: UserSettingAction;

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
    const userProfileManager = new UserProfileManager(postgresUserRepository);
    userSettingAction = new UserSettingAction(userProfileManager);
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("editUserSetting", () => {
    test("editUserSetting should edit user setting", async () => {
        // テスト用のユーザー情報を作成する。
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // 認証済みユーザーを取得する。
        const responseAuthenticatedUser = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseAuthenticatedUser === null) throw new Error("The user does not exist.");

        // ユーザー設定を取得する。
        const responseFindUserSettingByProfileId = await delayAsync(() => postgresUserRepository.findUserSettingByProfileId(profileId));

        // ユーザー設定が存在しない場合、エラーを投げる。
        if (responseFindUserSettingByProfileId === null) throw new Error("The user setting does not exist.");

        // ユーザー設定を更新する。
        const response = await delayAsync(() => userSettingAction.editUserSetting(responseFindUserSettingByProfileId));

        // 結果を検証する。
        expect(response).toBe(true);
    });
});