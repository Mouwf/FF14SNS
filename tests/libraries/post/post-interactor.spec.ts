import { describe, test, expect, beforeEach } from "@jest/globals";
import MockPostContentRepository from "../../repositories/post/mock-post-content-repository";
import PostInteractor from "../../../app/libraries/post/post-interactor";
import systemMessages from "../../../app/messages/system-messages";

/**
 * 投稿に関する処理を行うクラス。
 */
let postInteractor: PostInteractor;

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
    postInteractor = new PostInteractor(mockPostContentRepository);
});

describe("post", () => {
    test("post should post a message and return a post id.", async () => {
        // メッセージを投稿する。
        const postId = await postInteractor.post(posterId, releaseInformationId, content);

        // 結果を検証する。
        expect(postId).toBe(1);
    });

    test("post should throw an exception invalid content.", async () => {
        expect.assertions(1);
        try {
            // 無効な内容でメッセージを投稿し、エラーを発生させる。
            const invalidContent = "invalid_content";
            await postInteractor.post(posterId, releaseInformationId, invalidContent);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe(systemMessages.error.postFailed);
        }
    });
});