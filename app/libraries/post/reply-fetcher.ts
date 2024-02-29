import systemMessages from "../../messages/system-messages";
import ReplyContent from "../../models/post/reply-content";
import IReplyContentRepository from "../../repositories/post/i-reply-content-repository";

/**
 * リプライを取得するクラス。
 */
export default class ReplyFetcher {
    /**
     * リプライを取得するクラスを生成する。
     * @param replyContentRepository リプライ内容リポジトリ。
     */
    constructor(
        private readonly replyContentRepository: IReplyContentRepository,
    ) {
    }

    /**
     * 指定されたリプライを取得する。
     * @param replyId リプライID。
     * @returns 取得したリプライ。
     */
    public async fetchReplyById(replyId: number): Promise<ReplyContent> {
        try {
            const reply = await this.replyContentRepository.getById(replyId);
            return reply;
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.replyRetrievalFailed);
        }
    }
}