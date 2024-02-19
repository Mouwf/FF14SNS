import { describe, test, expect, beforeEach } from "@jest/globals";
import MockPostContentRepository from "../../repositories/post/mock-post-content-repository";
import PostsFetcher from "../../../app/libraries/post/posts-fetcher";
import systemMessages from "../../../app/messages/system-messages";

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

    test("fetchLatestPosts should throw an exception invalid profile id.", async () => {
        expect.assertions(1);
        try {
            // 無効なプロフィールIDで最新の投稿を取得し、エラーを発生させる。
            const invalidProfileId = "invalid_profile_id";
            await postsFetcher.fetchLatestPosts(invalidProfileId, 1000);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe(systemMessages.error.postRetrievalFailed);
        }
    });
});