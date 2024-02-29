import RepliesFetcher from "../../libraries/post/replies-fetcher";
import ReplyContent from "../../models/post/reply-content";

/**
 * 指定された投稿の全てのリプライを取得するローダー。
 */
export default class RepliesLoader {
    /**
     * 指定された投稿の全てのリプライを取得するローダーを生成する。
     * @param repliesFetcher 複数のリプライを取得するクラス。
     */
    constructor(
        private readonly repliesFetcher: RepliesFetcher,
    ) {
    }

    /**
     * 指定された投稿の全てのリプライを取得する。
     * @param postId 投稿ID。
     * @returns 指定された投稿の全てのリプライ。
     */
    public async getAllRepliesByPostId(postId: number): Promise<ReplyContent[]> {
        const replies = await this.repliesFetcher.fetchAllByPostId(postId);
        return replies;
    }
}