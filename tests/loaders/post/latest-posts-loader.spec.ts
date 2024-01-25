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
    test("getLatestPosts should return 1000 PostContent objects with correct values.", async () => {
        // 最新の投稿を取得する。
        const response = await latestPostsLoader.getLatestPosts();

        // 結果を検証する。
        expect(response.length).toBe(1000);
        response.forEach((postContent, i) => {
            const incrementedId = i + 1;
            const content = `Content ${incrementedId}`;
            expect(postContent).toEqual({
                id: incrementedId,
                posterId: 1,
                posterName: "UserName@World",
                releaseInformationId: 1,
                releaseVersion: "5.5",
                releaseName: "ReleaseName",
                content: content,
                createdAt: expect.any(Date),
            });
        });
    });
});