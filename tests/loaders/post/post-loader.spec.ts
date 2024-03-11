import { describe, test, expect, beforeEach } from "@jest/globals";
import MockPostContentRepository from "../../repositories/post/mock-post-content-repository";
import PostFetcher from "../../../app/libraries/post/post-fetcher";
import PostLoader from "../../../app/loaders/post/post-loader";

/**
 * 投稿を取得するローダー。
 */
let postLoader: PostLoader;

beforeEach(() => {
    const postContentRepository = new MockPostContentRepository();
    const postFetcher = new PostFetcher(postContentRepository);
    postLoader = new PostLoader(postFetcher);
});

describe("getPost", () => {
    test("getPost should return a post.", async () => {
        // 投稿を取得する。
        const postId = 1;
        const response = await postLoader.getPostById(postId);

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