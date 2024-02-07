import { describe, test, expect, beforeEach } from "@jest/globals";
import { AppLoadContext } from "@remix-run/node";
import { appLoadContext } from "../../../app/dependency-injector/get-load-context";
import { loader, action } from "../../../app/routes/app.post-message/route";
import { commitSession, getSession } from "../../../app/sessions";
import { newlyPostedPostCookie } from "../../../app/cookies.server";

/**
 * リリース情報が少ないボディ付きのモックリクエスト。
 */
let requestForReleaseInformationSession1: Request;

/**
 * リリース情報が多いボディ付きのモックリクエスト。
 */
let requestForReleaseInformationSession2: Request;

/**
 * ボディ付きのモックリクエスト。
 */
let requestWithCookieAndBody: Request;

/**
 * クッキーが不正なモックリクエスト。
 */
let requestWithInvalidCookie: Request;

/**
 * 登録されていないクッキー付きのモックリクエスト。
 */
let requestWithNotRegisteredUserCookie: Request;

/**
 * モックコンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    const getReleaseInformationSession1 = await getSession();
    getReleaseInformationSession1.set("idToken", "idToken");
    getReleaseInformationSession1.set("refreshToken", "refreshToken");
    getReleaseInformationSession1.set("userId", "username_world1");
    requestForReleaseInformationSession1 = new Request("https://example.com", {
        headers: {
            Cookie: await commitSession(getReleaseInformationSession1),
        },
    });
    const getReleaseInformationSession2 = await getSession();
    getReleaseInformationSession2.set("idToken", "idToken");
    getReleaseInformationSession2.set("refreshToken", "refreshToken");
    getReleaseInformationSession2.set("userId", "username_world2");
    requestForReleaseInformationSession2 = new Request("https://example.com", {
        headers: {
            Cookie: await commitSession(getReleaseInformationSession2),
        },
    });
    requestWithCookieAndBody = new Request("https://example.com", {
        headers: {
            Cookie: await commitSession(getReleaseInformationSession1),
        },
        method: "POST",
        body: new URLSearchParams({
            releaseInformationId: "5",
            content: "アクション経由の投稿テスト！",
        }),
    });
    const validSession = await getSession();
    validSession.set("idToken", "idToken");
    validSession.set("refreshToken", "refreshToken");
    validSession.set("userId", "username_world1");
    requestWithCookieAndBody = new Request("https://example.com", {
        headers: {
            Cookie: await commitSession(validSession),
        },
        method: "POST",
        body: new URLSearchParams({
            releaseInformationId: "1",
            content: "アクション経由の投稿テスト！",
        }),
    });
    const invalidSession = await getSession();
    invalidSession.set("idToken", "idToken");
    invalidSession.set("refreshToken", "refreshToken");
    invalidSession.set("userId", "invalidProfileId");
    requestWithInvalidCookie = new Request("https://example.com", {
        headers: {
            Cookie: await commitSession(invalidSession),
        },
        method: "POST",
        body: new URLSearchParams({
            releaseInformationId: "1",
            content: "アクション経由の投稿テスト！",
        }),
    });
    const notRegisteredUserSession = await getSession();
    notRegisteredUserSession.set("idToken", "notRegisteredUserIdToken");
    notRegisteredUserSession.set("refreshToken", "refreshToken");
    notRegisteredUserSession.set("userId", "notExistProfileId");
    requestWithNotRegisteredUserCookie = new Request("https://example.com", {
        headers: {
            Cookie: await commitSession(notRegisteredUserSession),
        },
    });
    context = appLoadContext;
});

describe("loader", () => {
    test("loader should return release information.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: requestForReleaseInformationSession1,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const resultAllReleaseInformation = await response.json();

        // 結果を検証する。
        expect(resultAllReleaseInformation.length).toBe(3);
        resultAllReleaseInformation.map((releaseInformation) => {
            expect(releaseInformation.id).toBeDefined();
            expect(releaseInformation.releaseVersion).toBeDefined();
            expect(releaseInformation.releaseName).toBeDefined();
            expect(new Date(releaseInformation.createdAt)).toBeInstanceOf(Date);
        });
    });

    test("loader should return release information.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: requestForReleaseInformationSession2,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const resultAllReleaseInformation = await response.json();

        // 結果を検証する。
        expect(resultAllReleaseInformation.length).toBe(5);
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
        // アクションを実行し、結果を取得する。
        const response = await action({
            request: requestWithCookieAndBody,
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
        expect(cookie).toEqual({
            postId: 1,
        });
    });

    test("action should return error message if user is not exist.", async () => {
        // アクションを実行し、結果を取得する。
        const response = await action({
            request: requestWithNotRegisteredUserCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const errorInformation = await response.json();

        // 結果を検証する。
        expect(errorInformation).toBeDefined();
    });

    test("action should return error message when profile id is invalid.", async () => {
        // アクションを実行し、結果を取得する。
        const response = await action({
            request: requestWithInvalidCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const errorInformation = await response.json();

        // 結果を検証する。
        expect(errorInformation).toBeDefined();
    });
});