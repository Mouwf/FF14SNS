import { describe, test, expect, beforeEach } from "@jest/globals";
import MockPostContentRepository from "../../repositories/post/mock-post-content-repository";
import PostsFetcher from "../../../app/libraries/post/posts-fetcher";

/**
 * 投稿を取得するクラス。
 */
let postsFetcher: PostsFetcher;

beforeEach(() => {
    const postContentRepository = new MockPostContentRepository();
    postsFetcher = new PostsFetcher(postContentRepository);
});

describe("fetchLatestPosts", () => {
    test("fetchLatestPosts should return 1000 posts.", async () => {
        // 最新の投稿を取得する。
        const profileId = "username_world1";
        const response = await postsFetcher.fetchLatestPosts(profileId, 1000);

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

    test("fetchLatestPosts should return 500 posts.", async () => {
        // 最新の投稿を取得する。
        const profileId = "username_world2";
        const response = await postsFetcher.fetchLatestPosts(profileId, 500);

        // 結果を検証する。
        expect(response.length).toBe(500);
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