import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import { AppLoadContext } from "@netlify/remix-runtime";
import { appLoadContext, postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import { loader, action } from "../../../../app/routes/app.setting/route";
import { commitSession, getSession } from "../../../../app/sessions";
import systemMessages from "../../../../app/messages/system-messages";

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
const currentReleaseInformationId = 4;

/**
 * モックリクエスト。
 */
let request: Request;

/**
 * モックコンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    postgresUserRepository = new PostgresUserRepository(postgresClientProvider);
    const session = await getSession();
    session.set("idToken", "idToken");
    session.set("refreshToken", "refreshToken");
    session.set("userId", profileId);
    request = new Request("https://example.com", {
        headers: {
            Cookie: await commitSession(session),
        },
        method: "POST",
        body: new URLSearchParams({
            userName: userName,
            currentReleaseInformationId: currentReleaseInformationId.toString(),
        }),
    });
    context = appLoadContext;
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("loader", () => {
    test("loader should return user setting and all release information.", async () => {
        // テスト用のユーザー情報を登録する。
        await postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId);

        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: request,
            params: {},
            context: context,
        });

        // 検証に必要な情報を取得する準備をする。
        const settingLoaderData = await response.json();

        // エラーが発生していた場合、エラーを投げる。
        if ('errorMessage' in settingLoaderData) {
            throw new Error(settingLoaderData.errorMessage);
        }

        // 検証に必要な情報を取得する。
        const userSetting = settingLoaderData.userSetting;
        const allReleaseInformation = settingLoaderData.allReleaseInformation;

        // 結果を検証する。
        expect(userSetting.userId).toBeDefined();
        expect(userSetting.userName).toBe(userName);
        expect(userSetting.currentReleaseInformationId).toBe(currentReleaseInformationId);
        expect(allReleaseInformation.length).toBeGreaterThan(0);
    });
});

describe("action", () => {
    test("action should return success message.", async () => {
        // テスト用のユーザー情報を登録する。
        await postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId);

        // アクションを実行し、結果を取得する。
        const response = await action({
            request: request,
            params: {},
            context: context,
        });

        // 検証に必要な情報を取得する。
        const responseJson = await response.json();

        // 結果が存在しない場合、エラーを投げる。
        if (!('successMessage' in responseJson) || !responseJson.successMessage) {
            throw new Error("Response is undefined.");
        }

        // 結果を検証する。
        expect(responseJson.successMessage).toBe(systemMessages.success.userSettingSaved);
    });
});