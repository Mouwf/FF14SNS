import systemMessages from "../../messages/system-messages";
import PostContent from '../../models/post/post-content';
import IPostContentRepository from '../../repositories/post/i-post-content-repository';

/**
 * 投稿を取得するクラス。
 */
export default class PostFetcher {
    /**
     * 投稿を取得するクラスを生成する。
     * @param postContentRepository 投稿を取得するリポジトリ。
     */
    constructor(
        private readonly postContentRepository: IPostContentRepository,
    ) {
    }

    /**
     * 指定された投稿を取得する。
     * @param postId 投稿ID。
     * @returns 取得した投稿。
     */
    public async fetchPostById(postId: number): Promise<PostContent> {
        try {
            const post = await this.postContentRepository.getById(postId);
            return post;
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.postRetrievalFailed);
        }
    }
}