import PostFetcher from "../../libraries/post/post-fetcher";
import PostContent from "../../models/post/post-content";

/**
 * 投稿を取得するローダー。
 */
export default class PostLoader {
    /**
     * 投稿を取得するローダーを生成する。
     * @param postFetcher 投稿を取得するクラス。
     */
    constructor(
        private readonly postFetcher: PostFetcher,
    ) {
    }

    /**
     * 指定された投稿を取得する。
     * @param postId 投稿ID。
     * @returns 取得した投稿。
     */
    public async getPostById(postId: number): Promise<PostContent> {
        const post = await this.postFetcher.fetchPostById(postId);
        return post;
    }
}