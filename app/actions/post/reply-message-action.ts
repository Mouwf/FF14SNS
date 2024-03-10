import PostInteractor from "../../libraries/post/post-interactor";

/**
 * リプライを行うアクション。
 */
export default class ReplyMessageAction {
    /**
     * リプライを行うアクションを生成する。
     * @param postInteractor 投稿に関する処理を行うクラス。
     */
    constructor(
        private readonly postInteractor: PostInteractor,
    ) {
    }

    /**
     * リプライを行う。
     * @param replierId リプライ者ID。
     * @param origianlPostId リプライ先投稿ID。
     * @param originalReplyId リプライ先リプライID。
     * @param content リプライ内容。
     */
    public async reply(replierId: number, origianlPostId: number, originalReplyId: number | null, content: string): Promise<number> {
        const replyId = await this.postInteractor.reply(replierId, origianlPostId, originalReplyId, content);
        return replyId;
    }
}