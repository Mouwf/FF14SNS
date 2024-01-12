import { describe, test, expect, beforeEach } from "@jest/globals";
import LatestPostsLoader from "../../../app/loaders/post/latest-posts-loader";

/**
 * 最新の投稿を取得するローダー。
 */
let latestPostsLoader: LatestPostsLoader;

beforeEach(() => {
    latestPostsLoader = new LatestPostsLoader();
});

describe("getLatestPosts", () => {
    test("getLatestPosts should return 10 PostContent objects with correct values.", async () => {
        // 最新の投稿を取得する。
        const id = "0";
        const response = await latestPostsLoader.getLatestPosts(id);

        // 結果を検証する。
        expect(response.length).toBe(10);
        response.forEach((postContent, i) => {
            const incrementedId = (i + Number(id) + 1).toString();
            const content = `
                これはポスト${incrementedId}のテストです。\n
                これはポスト${incrementedId}のテストです。\n
                これはポスト${incrementedId}のテストです。\n
                これはポスト${incrementedId}のテストです。\n
                これはポスト${incrementedId}のテストです。\n
            `
            expect(postContent).toEqual({
                id: incrementedId,
                releaseVersion: "5.5",
                tag: "考察",
                createdAt: expect.any(Date),
                content: content,
            });
        });
    });
});