import { describe, test, expect, beforeEach } from "@jest/globals";
import MockPostContentRepository from "../../repositories/post/mock-post-content-repository";
import PostInteractor from "../../../app/libraries/post/post-interactor";

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
const releaseId = 1;

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
        const postId = await postInteractor.post(posterId, releaseId, content);

        // 結果を検証する。
        expect(postId).toBe(1);
    });
});