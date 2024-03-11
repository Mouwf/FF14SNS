import PostFetchLimit from "../../libraries/post/post-fetch-limit";
import PostsFetcher from "../../libraries/post/posts-fetcher";
import PostContent from "../../models/post/post-content";

/**
 * 最新の投稿を取得するローダー。
 */
export default class LatestPostsLoader extends PostFetchLimit {
    /**
     * 最新の投稿を取得するローダーを生成する。
     * @param postsFetcher 複数の投稿を取得するクラス。
     */
    constructor(
        private readonly postsFetcher: PostsFetcher,
    ) {
        super();
    }

    /**
     * 最新の投稿を取得する。
     * @param profileId プロフィールID。
     * @returns 最新の投稿。
     */
    public async getLatestPosts(profileId: string): Promise<PostContent[]> {
        const postContents = await this.postsFetcher.fetchLatestPosts(profileId, this.postsLimit);
        return postContents;
    }
}