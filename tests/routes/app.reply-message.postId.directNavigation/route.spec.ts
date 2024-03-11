import { describe, test, expect, beforeEach } from "@jest/globals";
import { AppLoadContext } from "@remix-run/node";
import { appLoadContext } from "../../../app/dependency-injector/get-load-context";
import { loader, action } from "../../../app/routes/app.reply-message.$postId.$directNavigation/route";
import { commitSession, getSession } from "../../../app/sessions";
import systemMessages from "../../../app/messages/system-messages";

/**
 * モックリクエスト。
 */
let request: Request;

/**
 * ボディ付きのモックリクエスト。
 */
let requestWithCookieAndBody: Request;

/**
 * モックコンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    request = new Request("https://example.com");
    const session = await getSession();
    session.set("idToken", "idToken");
    session.set("refreshToken", "refreshToken");
    session.set("userId", "username_world1");
    requestWithCookieAndBody = new Request("https://example.com", {
        headers: {
            Cookie: await commitSession(session),
        },
        method: "POST",
        body: new URLSearchParams({
            content: "アクション経由の投稿テスト！",
        }),
    });
    context = appLoadContext;
});

describe("loader", () => {
    test("loader should return a post.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: request,
            params: {
                postId: "1",
                directNavigation: "direct",
            },
            context,
        });

        // 検証に必要な情報を取得する。
        const result = await response.json();

        // エラーが発生していた場合、エラーを投げる。
        if ("errorMessage" in result) {
            throw new Error(result.errorMessage);
        }

        // 結果を検証する。
        expect(result).toEqual({
            id: 1,
            posterId: 1,
            posterName: "UserName@World",
            releaseInformationId: 1,
            releaseVersion: "5.5",
            releaseName: "ReleaseName",
            replyCount: 4,
            content: "Content 1",
            createdAt: expect.any(String),
        });
    });
});

describe("action", () => {
    test("action should return a success message.", async () => {
        // アクションを実行し、結果を取得する。
        const response = await action({
            request: requestWithCookieAndBody,
            params: {
                postId: "1",
                directNavigation: "direct",
            },
            context,
        });

        // 検証に必要な情報を取得する。
        const result = await response.json();

        // 結果が存在しない場合、エラーを投げる。
        if (!("successMessage" in result) || !result.successMessage) {
            throw new Error("Response is undefined.");
        }

        // 結果を検証する。
        expect(result.successMessage).toBe(systemMessages.success.replyMessagePosted);
    });
});