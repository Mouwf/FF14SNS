import { describe, test, expect, beforeEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import UserRegistrar from "../../../../app/libraries/user/user-registrar";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";

/**
 * Postgresのユーザーリポジトリ。
 */
let postgresUserRepository: PostgresUserRepository;

/**
 * ユーザーの登録を行うクラス。
 */
let userRegistrar: UserRegistrar;

/**
 * プロフィールID。
 */
const profileId = "username_world";

/**
 * ユーザー名。
 */
const userName = "UserName@World";

beforeEach(async () => {
    postgresUserRepository = new PostgresUserRepository(postgresClientProvider);
    userRegistrar = new UserRegistrar(postgresUserRepository);

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

describe("register", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("register should register a new user", async () => {
        // テスト用のユーザー情報を作成する。
        const response = await delayAsync(() => userRegistrar.register(profileId, userName));

        // 結果を検証する。
        expect(response).toBe(true);
    });

    test("register should throw an error when the authenticationProviderId is empty", async () => {
        expect.assertions(1);
        try {
            // テスト用のユーザー情報を作成する。
            await delayAsync(() => userRegistrar.register("", userName));
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
            await delayAsync(() => userRegistrar.register(profileId, ""));
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
            await delayAsync(() => userRegistrar.register(profileId, "invalidUserName"));
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

describe("delete", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("delete should delete a user", async () => {
        // テスト用のユーザー情報を作成する。
        await delayAsync(() => userRegistrar.register(profileId, userName));

        // テスト用のユーザー情報を取得する。
        const responseFindByProfileId = await delayAsync(() => postgresUserRepository.findByProfileId(profileId));

        // テスト用のユーザー情報が存在しない場合、エラーを投げる。
        if (responseFindByProfileId == null) throw new Error("The user does not exist.");

        // テスト用のユーザー情報を削除する。
        const id = responseFindByProfileId.id;
        const responseDelete = await delayAsync(() => userRegistrar.delete(id));

        // 結果を検証する。
        expect(responseDelete).toBe(true);
    });
});