import { describe, test, expect, beforeEach } from "@jest/globals";
import MockReplyContentRepository from "../../repositories/post/mock-reply-content-repository";
import RepliesFetcher from "../../../app/libraries/post/replies-fetcher";
import systemMessages from "../../../app/messages/system-messages";

/**
 * 複数のリプライを取得するクラス。
 */
let repliesFetcher: RepliesFetcher;

beforeEach(() => {
    const replyContentRepository = new MockReplyContentRepository();
    repliesFetcher = new RepliesFetcher(replyContentRepository);
});

describe("fetchAllByPostId", () => {
    test("fetchAllByPostId should return replies.", async () => {
        // リプライを取得する。
        const postId = 1;
        const response = await repliesFetcher.fetchAllByPostId(postId);

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

    test("fetchAllByPostId should return 500 replies.", async () => {
        // リプライを取得する。
        const postId = 2;
        const response = await repliesFetcher.fetchAllByPostId(postId);

        // 結果を検証する。
        expect(response.length).toBe(500);
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
                replyCount: 2,
                content: content,
                createdAt: expect.any(Date),
            });
        });
    });

    test("fetchAllByPostId should throw an error.", async () => {
        // リプライを取得する。
        expect.assertions(1);
        try {
            // 無効な投稿IDでリプライを取得し、エラーを発生させる。
            const postId = 3;
            await repliesFetcher.fetchAllByPostId(postId);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe(systemMessages.error.replyRetrievalFailed);
        }
    });
});