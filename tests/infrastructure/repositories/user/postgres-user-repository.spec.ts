import { describe, test, expect, beforeEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";

/**
 * Postgresのユーザーリポジトリ。
 */
let postgresUserRepository: PostgresUserRepository;

/**
 * プロフィールID。
 */
const profileId = "test_unicorn";

/**
 * 認証プロバイダーID。
 */
const authenticationProviderId = "test_authentication_provider_id";

/**
 * ユーザー名。
 */
const userName = "UserName@World";

beforeEach(async () => {
    // Postgresのユーザーリポジトリを生成する。
    postgresUserRepository = new PostgresUserRepository();

    // テスト用のユーザー情報が存在する場合、削除する。
    try {
        // テスト用のユーザー情報を取得する。
        const responseFindByProfileId = await delayAsync(() => postgresUserRepository.findByProfileId(profileId));

        // テスト用のユーザー情報が存在しない場合、エラーを投げる。
        if (responseFindByProfileId == null) throw new Error("The user does not exist.");

        const id = responseFindByProfileId.id;
        await delayAsync(() => postgresUserRepository.delete(id));
        console.info("テスト用のユーザー情報を削除しました。");
    } catch (error) {
        console.info("テスト用のユーザー情報は存在しませんでした。");
    }
});

describe("create", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("create should create a new user", async () => {
        // テスト用のユーザー情報を作成する。
        const response = await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName));

        // 結果を検証する。
        expect(response).toBe(true);
    });
});

describe("findByProfileId", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("findByProfileId should return a user", async () => {
        // テスト用のユーザー情報を作成する。
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName));

        // テスト用のユーザー情報を取得する。
        const response = await delayAsync(() => postgresUserRepository.findByProfileId(profileId));

        // ユーザー情報が取得できない場合、エラーを投げる。
        if (response == null) throw new Error("The user does not exist.");

        // 結果を検証する。
        expect(response.id).toBeDefined();
        expect(response.profileId).toBe(profileId);
        expect(response.authenticationProviderId).toBe(authenticationProviderId);
        expect(response.userName).toBe(userName);
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
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName));

        // テスト用のユーザー情報を取得する。
        const response = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // ユーザー情報が取得できない場合、エラーを投げる。
        if (response == null) throw new Error("The user does not exist.");

        // 結果を検証する。
        expect(response.id).toBeDefined();
        expect(response.profileId).toBe(profileId);
        expect(response.authenticationProviderId).toBe(authenticationProviderId);
        expect(response.userName).toBe(userName);
        expect(response.createdAt).toBeInstanceOf(Date);
    });

    test("findByAuthenticationProviderId should return null for a user that does not exist", async () => {
        // テスト用のユーザー情報を取得する。
        const response = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // 結果を検証する。
        expect(response).toBeNull();
    });
});