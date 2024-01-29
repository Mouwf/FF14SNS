import { describe, test, expect, beforeEach } from "@jest/globals";
import { AppLoadContext } from "@remix-run/node";
import { appLoadContext } from "../../../app/dependency-injector/get-load-context";
import { loader, action } from "../../../app/routes/app.post-message/route";
import { userAuthenticationCookie, newlyPostedPostCookie } from "../../../app/cookies.server";

/**
 * モックリクエスト。
 */
let request: Request;

/**
 * ボディ付きのモックリクエスト。
 */
let requestWithCookieAndBody: Request;

/**
 * クッキーが不正なモックリクエスト。
 */
let requestWithInvalidCookie: Request;

/**
 * モックコンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    request = new Request("https://example.com");
    requestWithCookieAndBody = new Request("https://example.com", {
        headers: {
            Cookie: await userAuthenticationCookie.serialize({
                idToken: "idToken",
            }),
        },
        method: "POST",
        body: new URLSearchParams({
            releaseInformationId: "1",
            content: "アクション経由の投稿テスト！",
        }),
    });
    requestWithInvalidCookie = new Request("https://example.com", {
        headers: {
            Cookie: await userAuthenticationCookie.serialize({
                idToken: "invalidIdToken",
            }),
        },
        method: "POST",
        body: new URLSearchParams({
            releaseInformationId: "1",
            content: "アクション経由の投稿テスト！",
        }),
    });
    context = appLoadContext;
});

describe("loader", () => {
    test("loader should return release information.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: request,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const resultAllReleaseInformation = await response.json();

        // 結果を検証する。
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

    test("action should return error message when id token is invalid.", async () => {
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