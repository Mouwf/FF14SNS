import PostContent from '../../models/post/post-content';
import IPostContentRepository from '../../repositories/post/i-post-content-repository';
import IPostsFetcher from './i-posts-fetcher';

/**
 * 投稿を取得するクラス。
 */
export default class PostsFetcher implements IPostsFetcher {
    /**
     * 投稿を取得するクラスを生成する。
     * @param postContentRepository 投稿を取得するリポジトリ。
     */
    constructor(
        private readonly postContentRepository: IPostContentRepository,
    ) {
    }

    public async fetchLatestPosts(numberOfPosts: number): Promise<PostContent[]> {
        const posts = await this.postContentRepository.getLatestLimited(numberOfPosts);
        return posts;
    }

    public async fetchPostsById(postId: number, numberOfPosts: number): Promise<PostContent[]> {
        throw new Error('Method not implemented.');
    }
}