import { describe, test, expect, beforeEach } from "@jest/globals";
import MockPostContentRepository from "../../repositories/post/mock-post-content-repository";
import PostsFetcher from "../../../app/libraries/post/posts-fetcher";
import LatestPostsLoader from "../../../app/loaders/post/latest-posts-loader";

/**
 * 最新の投稿を取得するローダー。
 */
let latestPostsLoader: LatestPostsLoader;

beforeEach(() => {
    const postContentRepository = new MockPostContentRepository();
    const postsFetcher = new PostsFetcher(postContentRepository);
    latestPostsLoader = new LatestPostsLoader(postsFetcher);
});

describe("getLatestPosts", () => {
    test("getLatestPosts should return 10 PostContent objects with correct values.", async () => {
        // 最新の投稿を取得する。
        const id = "0";
        const response = await latestPostsLoader.getLatestPosts();

        // 結果を検証する。
        expect(response.length).toBe(10);
        response.forEach((postContent, i) => {
            const incrementedId = (i + Number(id) + 1);
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
                createdAt: expect.any(Date),
                content: content,
            });
        });
    });
});