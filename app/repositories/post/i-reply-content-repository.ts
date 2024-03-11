import ReplyContent from "../../models/post/reply-content";

/**
 * リプライ内容リポジトリ。
 */
export default interface IReplyContentRepository {
    /**
     * リプライを作成する。
     * @param replierId リプライ者ID。
     * @param originalPostId リプライ先投稿ID。
     * @param originalReplyId リプライ先リプライID。
     * @param content リプライ内容。
     * @returns リプライID。
     */
    create(replierId: number, originalPostId: number, originalReplyId: number | null, content: string): Promise<number>;

    /**
     * リプライを削除する。
     * @param replyId リプライID。
     * @returns 削除に成功したかどうか。
     */
    delete(replyId: number): Promise<boolean>;

    /**
     * リプライIDでリプライを取得する。
     * @param replyId リプライID。
     * @returns 指定されたリプライ。
     */
    getById(replyId: number): Promise<ReplyContent>;

    /**
     * 指定された投稿の全てのリプライを取得する。
     * @param postId 投稿ID。
     * @returns 指定された投稿の全てのリプライ。
     */
    getAllByPostId(postId: number): Promise<ReplyContent[]>;
}