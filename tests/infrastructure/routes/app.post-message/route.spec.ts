import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import { AppLoadContext } from "@netlify/remix-runtime";
import { appLoadContext, postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import { loader, action } from "../../../../app/routes/app.post-message/route";
import { commitSession, getSession } from "../../../../app/sessions";
import { newlyPostedPostCookie } from "../../../../app/cookies.server";

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
            releaseInformationId: "1",
            content: "アクション経由の投稿テスト！",
        }),
    });
    context = appLoadContext;
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("loader", () => {
    test("loader should return release information.", async () => {
        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = "authenticationProviderId";
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: request,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const resultAllReleaseInformation = await response.json();

        // 結果を検証する。
        expect(resultAllReleaseInformation.length).toBe(currentReleaseInformationId);
        resultAllReleaseInformation.map((releaseInformation) => {
            expect(releaseInformation.id).toBeDefined();
            expect(releaseInformation.releaseVersion).toBeDefined();
            expect(releaseInformation.releaseName).toBeDefined();
            expect(new Date(releaseInformation.createdAt)).toBeInstanceOf(Date);
        });
    });
});

describe("action", () => {
    test("action should redirect to app page and return posted postId in the cookies.", async () => {
        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = "authenticationProviderId";
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // アクションを実行し、結果を取得する。
        const response = await action({
            request: request,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const status = response.status;
        const location = response.headers.get("Location");
        const cookie = await newlyPostedPostCookie.parse(response.headers.get("Set-Cookie"));

        // 結果を検証する。
        expect(status).toBe(302);
        expect(location).toBe("/app");
        expect(cookie.postId).toBeDefined();
    });
});