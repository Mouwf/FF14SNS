import { describe, test, expect, beforeEach } from "@jest/globals";
import MockPostContentRepository from "../../repositories/post/mock-post-content-repository";
import PostFetcher from "../../../app/libraries/post/post-fetcher";

/**
 * 投稿を取得するクラス。
 */
let postFetcher: PostFetcher;

beforeEach(() => {
    const postContentRepository = new MockPostContentRepository();
    postFetcher = new PostFetcher(postContentRepository);
});

describe("fetchPostById", () => {
    test("fetchPostById should return a post.", async () => {
        // 投稿を取得する。
        const postId = 1;
        const response = await postFetcher.fetchPostById(postId);

        // 結果を検証する。
        expect(response).toEqual({
            id: 1,
            posterId: 1,
            posterName: "UserName@World",
            releaseInformationId: 1,
            releaseVersion: "5.5",
            releaseName: "ReleaseName",
            replyCount: 4,
            content: "Content 1",
            createdAt: expect.any(Date),
        });
    });
});