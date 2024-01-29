import PostContent from '../../models/post/post-content';
import IPostContentRepository from '../../repositories/post/i-post-content-repository';

/**
 * 投稿を取得するクラス。
 */
export default class PostsFetcher {
    /**
     * 投稿を取得するクラスを生成する。
     * @param postContentRepository 投稿を取得するリポジトリ。
     */
    constructor(
        private readonly postContentRepository: IPostContentRepository,
    ) {
    }

    /**
     * 最新の投稿を指定された数取得する。
     * @param numberOfPosts 取得する投稿数。
     */
    public async fetchLatestPosts(numberOfPosts: number): Promise<PostContent[]> {
        const posts = await this.postContentRepository.getLatestLimited(numberOfPosts);
        return posts;
    }

    /**
     * 指定された投稿ID以前の投稿を指定された数取得する。
     * @param postId 投稿ID。
     * @param numberOfPosts 取得する投稿数。
     */
    public async fetchPostsById(postId: number, numberOfPosts: number): Promise<PostContent[]> {
        throw new Error('Method not implemented.');
    }
}