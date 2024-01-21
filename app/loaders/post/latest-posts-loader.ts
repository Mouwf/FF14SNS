import PostFetchLimit from "../../libraries/post/post-fetch-limit";
import IPostsFetcher from "../../libraries/post/i-posts-fetcher";
import PostContent from "../../models/post/post-content";

/**
 * 最新の投稿を取得するローダー。
 */
export default class LatestPostsLoader extends PostFetchLimit {
    /**
     * 最新の投稿を取得するローダーを生成する。
     * @param postsFetcher 投稿を取得するクラス。
     */
    constructor(
        private readonly postsFetcher: IPostsFetcher,
    ) {
        super();
    }

    /**
     * 最新の投稿を取得する。
     * @returns 最新の投稿。
     */
    public async getLatestPosts(): Promise<PostContent[]> {
        const postContents = await this.postsFetcher.fetchLatestPosts(this.postsLimit);
        return postContents;
    }
}