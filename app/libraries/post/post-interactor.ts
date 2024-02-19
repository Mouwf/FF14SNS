import systemMessages from "../../messages/system-messages";
import IPostContentRepository from '../../repositories/post/i-post-content-repository';

/**
 * 投稿に関する処理を行うクラス。
 */
export default class PostInteractor {
    /**
     * 投稿に関する処理を行うクラスを生成する。
     * @param postContentRepository 投稿内容リポジトリ。
     */
    constructor(
        private readonly postContentRepository: IPostContentRepository,
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
}