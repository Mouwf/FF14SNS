import IPoster from "../../libraries/post/i-poster";

/**
 * メッセージを投稿するアクション。
 */
export default class PostMessageAction {
    /**
     * 
     * @param poster メッセージを投稿するクラス。
     */
    constructor(
        private readonly poster: IPoster,
    ) {
    }

    /**
     * メッセージを投稿する。
     * @param posterId 投稿者ID。
     * @param releaseId 投稿に関連するリリース情報ID。
     * @param content 投稿内容。
     * @returns 投稿ID。
     */
    public async post(posterId: number, releaseId: number, content: string): Promise<number> {
        const postId = await this.poster.post(posterId, releaseId, content);
        return postId;
    }
}