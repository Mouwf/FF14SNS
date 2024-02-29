import systemMessages from "../../messages/system-messages";
import IPostContentRepository from "../../repositories/post/i-post-content-repository";
import IReplyContentRepository from "../../repositories/post/i-reply-content-repository";

/**
 * 投稿に関する処理を行うクラス。
 */
export default class PostInteractor {
    /**
     * 投稿に関する処理を行うクラスを生成する。
     * @param postContentRepository 投稿内容リポジトリ。
     * @param replyContentRepository リプライ内容リポジトリ。
     */
    constructor(
        private readonly postContentRepository: IPostContentRepository,
        private readonly replyContentRepository: IReplyContentRepository,
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
        try {
            const postId = await this.postContentRepository.create(posterId, releaseInformationId, content);
            return postId;
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.postFailed);
        }
    }

    /**
     * リプライを行う。
     * @param replierId リプライ者ID。
     * @param origianlPostId リプライ先投稿ID。
     * @param originalReplyId リプライ先リプライID。
     * @param content リプライ内容。
     */
    public async reply(replierId: number, origianlPostId: number, originalReplyId: number | null, content: string): Promise<void> {
        try {
            await this.replyContentRepository.create(replierId, origianlPostId, originalReplyId, content);
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.replyFailed);
        }
    }
}