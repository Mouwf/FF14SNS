import { describe, test, expect, beforeEach } from "@jest/globals";
import { AppLoadContext } from "@netlify/remix-runtime";
import appLoadContext from "../../dependency-injector/app-load-context";
import { action } from "../../../app/routes/app.post-message/route";
import { newlyPostedPostCookie } from "../../../app/cookies.server";

/**
 * モックリクエスト。
 */
let request: Request;

/**
 * モックコンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    request = new Request("https://example.com", {
        method: "POST",
        body: new URLSearchParams({
            releaseVersion: "パッチ5",
            tag: "タグ2",
            content: "アクション経由の投稿テスト！",
        }),
    });
    context = appLoadContext;
});

describe('action', () => {
    test('action should set cookie about post.', async () => {
        // アクションを実行し、結果を取得する。
        const response = await action({
            request,
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
            releaseVersion: "パッチ5",
            tag: "タグ2",
            content: "アクション経由の投稿テスト！",
            isPosted: true,
        });
    });
});