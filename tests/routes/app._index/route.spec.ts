import { describe, test, expect, beforeEach } from "@jest/globals";
import { AppLoadContext } from "@remix-run/node";
import { appLoadContext } from "../../../app/dependency-injector/get-load-context";
import { loader } from "../../../app/routes/app._index/route";
import { commitSession, getSession } from "../../../app/sessions";
import { newlyPostedPostCookie } from "../../../app/cookies.server";

/**
 * クッキーなしのモックリクエスト。
 */
let requestWithoutCookie: Request;

/**
 * セッションとクッキー付きのモックリクエスト。
 */
let requestWithSessionAndCookie: Request;

/**
 * モックコンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    const session = await getSession();
    session.set("idToken", "idToken");
    session.set("refreshToken", "refreshToken");
    session.set("userId", "username_world1");
    const cookieSession = await commitSession(session);
    const cookieNewlyPostedPost = await newlyPostedPostCookie.serialize({
        releaseVersion: "パッチ5",
        tag: "タグ2",
        content: "クッキー経由の投稿テスト！",
        isPosted: true,
    });
    requestWithoutCookie = new Request("https://example.com", {
        headers: {
            Cookie: cookieSession,
        },
    });
    requestWithSessionAndCookie = new Request("https://example.com", {
        headers: {
            Cookie: `${cookieSession}; ${cookieNewlyPostedPost}`,
        },
    });
    context = appLoadContext;
});

describe("loader", () => {
    test("loader should return 1000 posts.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: requestWithoutCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const resultPostContents = await response.json();

        // 結果を検証する。
        expect(resultPostContents.length).toBe(1000);
    });

    test("loader should return 1000 posts with cookie.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: requestWithSessionAndCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const resultPostContents = await response.json();

        // 結果を検証する。
        expect(resultPostContents.length).toBe(1000);
    });
});