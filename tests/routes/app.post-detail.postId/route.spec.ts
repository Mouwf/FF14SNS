import { describe, test, expect, beforeEach } from "@jest/globals";
import { AppLoadContext } from "@remix-run/node";
import { appLoadContext } from "../../../app/dependency-injector/get-load-context";
import { loader } from "../../../app/routes/app.post-detail.$postId/route";

/**
 * モックリクエスト。
 */
let request: Request;

/**
 * モックコンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    request = new Request("https://example.com");
    context = appLoadContext;
});

describe("loader", () => {
    test("loader should return a post and its replies.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: request,
            params: {
                postId: "1",
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
        expect(result.post).toEqual({
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
        expect(result.replies.length).toBe(1000);
        result.replies.forEach((postContent, i) => {
            const incrementedId = i + 1;
            const content = `Content ${incrementedId}`;
            expect(postContent).toEqual({
                id: incrementedId,
                posterId: 1,
                posterName: "UserName@World",
                originalPostId: 1,
                originalReplyId: incrementedId,
                replyNestingLevel: incrementedId,
                releaseInformationId: 1,
                releaseVersion: "5.5",
                releaseName: "ReleaseName",
                replyCount: 4,
                content: content,
                createdAt: expect.any(String),
            });
        });
    });
});