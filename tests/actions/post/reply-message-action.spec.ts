import { describe, test, expect, beforeEach } from "@jest/globals";
import MockPostContentRepository from "../../repositories/post/mock-post-content-repository";
import MockReplyContentRepository from "../../repositories/post/mock-reply-content-repository";
import PostInteractor from "../../../app/libraries/post/post-interactor";
import ReplyMessageAction from "../../../app/actions/post/reply-message-action";

/**
 * リプライを行うアクション。
 */
let replyMessageAction: ReplyMessageAction;

/**
 * 投稿者ID。
 */
const posterId = 1;

/**
 * リプライ先投稿ID。
 */
const originalPostId = 1;

/**
 * リプライ内容。
 */
const content = "Content";

beforeEach(() => {
    const mockPostContentRepository = new MockPostContentRepository();
    const mockReplyContentRepository = new MockReplyContentRepository();
    const postInteractor = new PostInteractor(mockPostContentRepository, mockReplyContentRepository);
    replyMessageAction = new ReplyMessageAction(postInteractor);
});

describe("reply", () => {
    test("reply should reply a message and return a reply id.", async () => {
        // リプライを行う。
        const replyId = await replyMessageAction.reply(posterId, originalPostId, null, content);

        // 結果を検証する。
        expect(replyId).toBe(1);
    });
});