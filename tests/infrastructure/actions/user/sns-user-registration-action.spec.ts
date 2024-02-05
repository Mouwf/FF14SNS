import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import UserProfileManager from "../../../../app/libraries/user/user-profile-manager";
import SnsUserRegistrationAction from "../../../../app/actions/user/sns-user-registration-action";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";

/**
 * Postgresのユーザーリポジトリ。
 */
let postgresUserRepository: PostgresUserRepository;

/**
 * SNSのユーザー登録を行うアクション。
 */
let snsUserRegistrationAction: SnsUserRegistrationAction;

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
    snsUserRegistrationAction = new SnsUserRegistrationAction(userProfileManager);
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("register", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("register should register a new user", async () => {
        // テスト用のユーザー情報を作成する。
        const response = await delayAsync(() => snsUserRegistrationAction.register(profileId, userName, currentReleaseInformationId));

        // 結果を検証する。
        expect(response).toBe(true);
    });
});

describe("delete", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("delete should delete a user", async () => {
        // テスト用のユーザー情報を作成する。
        await delayAsync(() => snsUserRegistrationAction.register(profileId, userName, currentReleaseInformationId));

        // テスト用のユーザー情報を取得する。
        const responseFindByProfileId = await delayAsync(() => postgresUserRepository.findByProfileId(profileId));

        // テスト用のユーザー情報が存在しない場合、エラーを投げる。
        if (responseFindByProfileId == null) throw new Error("The user does not exist.");

        // テスト用のユーザー情報を削除する。
        const id = responseFindByProfileId.id;
        const responseDelete = await delayAsync(() => snsUserRegistrationAction.delete(id));

        // 結果を検証する。
        expect(responseDelete).toBe(true);
    });
});