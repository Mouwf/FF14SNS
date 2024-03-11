import { describe, test, expect, beforeEach } from "@jest/globals";
import MockPostContentRepository from "../../repositories/post/mock-post-content-repository";
import MockReplyContentRepository from "../../repositories/post/mock-reply-content-repository";
import PostInteractor from "../../../app/libraries/post/post-interactor";
import PostMessageAction from "../../../app/actions/post/post-message-action";

/**
 * メッセージを投稿するアクション。
 */
let postMessageAction: PostMessageAction;

/**
 * 投稿者ID。
 */
const posterId = 1;

/**
 * リリース情報ID。
 */
const releaseInformationId = 1;

/**
 * 投稿内容。
 */
const content = "Content";

beforeEach(() => {
    const mockPostContentRepository = new MockPostContentRepository();
    const mockReplyContentRepository = new MockReplyContentRepository();
    const postInteractor = new PostInteractor(mockPostContentRepository, mockReplyContentRepository);
    postMessageAction = new PostMessageAction(postInteractor);
});

describe("post", () => {
    test("post should post a message and return a post id.", async () => {
        // メッセージを投稿する。
        const postId = await postMessageAction.post(posterId, releaseInformationId, content);

        // 結果を検証する。
        expect(postId).toBe(1);
    });
});