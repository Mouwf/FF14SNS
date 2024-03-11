import { describe, test, expect, beforeEach } from "@jest/globals";
import MockReplyContentRepository from "../../repositories/post/mock-reply-content-repository";
import ReplyFetcher from "../../../app/libraries/post/reply-fetcher";
import ReplyLoader from "../../../app/loaders/post/reply-loader";

/**
 * リプライを取得するローダー。
 */
let replyLoader: ReplyLoader;

beforeEach(() => {
    const replyContentRepository = new MockReplyContentRepository();
    const replyFetcher = new ReplyFetcher(replyContentRepository);
    replyLoader = new ReplyLoader(replyFetcher);
});

describe("getReplyById", () => {
    test("getReplyById should return a reply.", async () => {
        // リプライを取得する。
        const replyId = 1;
        const response = await replyLoader.getReplyById(replyId);

        // 結果を検証する。
        expect(response).toEqual({
            id: 1,
            posterId: 1,
            posterName: "UserName@World",
            originalPostId: 1,
            originalReplyId: 1,
            replyNestingLevel: 0,
            releaseInformationId: 1,
            releaseVersion: "5.5",
            releaseName: "ReleaseName",
            replyCount: 4,
            content: "Content 1",
            createdAt: expect.any(Date),
        });
    });
});