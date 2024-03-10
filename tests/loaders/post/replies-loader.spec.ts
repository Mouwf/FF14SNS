import { describe, test, expect, beforeEach } from "@jest/globals";
import MockReplyContentRepository from "../../repositories/post/mock-reply-content-repository";
import RepliesFetcher from "../../../app/libraries/post/replies-fetcher";
import RepliesLoader from "../../../app/loaders/post/replies-loader";

/**
 * 指定された投稿の全てのリプライを取得するローダー。
 */
let repliesLoader: RepliesLoader;

beforeEach(() => {
    const replyContentRepository = new MockReplyContentRepository();
    const repliesFetcher = new RepliesFetcher(replyContentRepository);
    repliesLoader = new RepliesLoader(repliesFetcher);
});

describe("getAllRepliesByPostId", () => {
    test("getAllRepliesByPostId should return 1000 replies.", async () => {
        // リプライを取得する。
        const postId = 1;
        const response = await repliesLoader.getAllRepliesByPostId(postId);

        // 結果を検証する。
        expect(response.length).toBe(1000);
        response.forEach((postContent, i) => {
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
                createdAt: expect.any(Date),
            });
        });
    });
});