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
     * ユーザーが設定したリリースバージョン以下の最新の投稿を指定された数取得する。
     * @param profileId プロフィールID。
     * @param numberOfPosts 取得する投稿数。
     */
    public async fetchLatestPosts(profileId: string, numberOfPosts: number): Promise<PostContent[]> {
        const posts = await this.postContentRepository.getLatestLimited(profileId, numberOfPosts);
        return posts;
    }

    /**
     * ユーザーが設定したリリースバージョン以下の指定された投稿ID以前の投稿を指定された数取得する。
     * @param postId 投稿ID。
     * @param numberOfPosts 取得する投稿数。
     */
    public async fetchPostsById(postId: number, numberOfPosts: number): Promise<PostContent[]> {
        throw new Error('Method not implemented.');
    }
}