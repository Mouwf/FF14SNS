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
     */
    create(replierId: number, originalPostId: number, originalReplyId: number | null, content: string): Promise<void>;

    /**
     * リプライを削除する。
     * @param replyId リプライID。
     */
    delete(replyId: number): Promise<boolean>;

    /**
     * リプライIDでリプライを取得する。
     * @param replyId リプライID。
     */
    getById(replyId: number): Promise<ReplyContent>;

    /**
     * 指定された投稿の全てのリプライを取得する。
     * @param postId 投稿ID。
     */
    getAllByPostId(postId: number): Promise<ReplyContent[]>;
}