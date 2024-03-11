import systemMessages from "../../messages/system-messages";
import ReplyContent from "../../models/post/reply-content";
import IReplyContentRepository from "../../repositories/post/i-reply-content-repository";


/**
 * 複数のリプライを取得するクラス。
 */
export default class RepliesFetcher {
    /**
     * 複数のリプライを取得するクラスを生成する。
     * @param replyContentRepository リプライ内容リポジトリ。
     */
    constructor(
        private readonly replyContentRepository: IReplyContentRepository,
    ) {
    }

    /**
     * 指定された投稿の全てのリプライを取得する。
     * @param postId 投稿ID。
     * @returns 指定された投稿の全てのリプライ。
     */
    public async fetchAllByPostId(postId: number): Promise<ReplyContent[]> {
        try {
            const replies = await this.replyContentRepository.getAllByPostId(postId);
            return replies;
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.replyRetrievalFailed);
        }
    }
}