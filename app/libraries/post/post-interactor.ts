import IPoster from './i-poster';
import IPostContentRepository from '../../repositories/post/i-post-content-repository';

/**
 * 投稿に関する処理を行うクラス。
 */
export default class PostInteractor implements IPoster {
    /**
     * 投稿に関する処理を行うクラスを生成する。
     * @param postContentRepository 投稿内容リポジトリ。
     */
    constructor(
        private readonly postContentRepository: IPostContentRepository,
    ) {
    }

    public async post(posterId: number, releaseInformationId: number, content: string): Promise<number> {
        const postId = await this.postContentRepository.create(posterId, releaseInformationId, content);
        return postId;
    }
}