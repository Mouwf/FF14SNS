import ReplyFetcher from "../../libraries/post/reply-fetcher";
import ReplyContent from "../../models/post/reply-content";

/**
 * リプライを取得するローダー。
 */
export default class ReplyLoader {
    /**
     * リプライを取得するローダーを生成する。
     * @param replyFetcher リプライを取得するクラス。
     */
    constructor(
        private readonly replyFetcher: ReplyFetcher,
    ) {
    }

    /**
     * 指定されたリプライを取得する。
     * @param replyId リプライID。
     * @returns 取得したリプライ。
     */
    public async getReplyById(replyId: number): Promise<ReplyContent> {
        const reply = await this.replyFetcher.fetchReplyById(replyId);
        return reply;
    }
}