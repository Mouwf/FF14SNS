import PostInteractor from "../../libraries/post/post-interactor";

/**
 * メッセージを投稿するアクション。
 */
export default class PostMessageAction {
    /**
     * メッセージを投稿するアクションを生成する。
     * @param postInteractor 投稿に関する処理を行うクラス。
     */
    constructor(
        private readonly postInteractor: PostInteractor,
    ) {
    }

    /**
     * メッセージを投稿する。
     * @param posterId 投稿者ID。
     * @param releaseInformationId 投稿に関連するリリース情報ID。
     * @param content 投稿内容。
     * @returns 投稿ID。
     */
    public async post(posterId: number, releaseInformationId: number, content: string): Promise<number> {
        const postId = await this.postInteractor.post(posterId, releaseInformationId, content);
        return postId;
    }
}