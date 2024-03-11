import { describe, test, expect, beforeEach } from "@jest/globals";
import MockReplyContentRepository from "../../repositories/post/mock-reply-content-repository";
import ReplyFetcher from "../../../app/libraries/post/reply-fetcher";

/**
 * リプライを取得するクラス。
 */
let replyFetcher: ReplyFetcher;

beforeEach(() => {
    const replyContentRepository = new MockReplyContentRepository();
    replyFetcher = new ReplyFetcher(replyContentRepository);
});

describe("fetchReplyById", () => {
    test("fetchReplyById should return a reply.", async () => {
        // リプライを取得する。
        const replyId = 1;
        const response = await replyFetcher.fetchReplyById(replyId);

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