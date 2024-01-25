import PostContent from "../../models/post/post-content";

/**
 * 投稿を取得するインターフェース。
 */
export default interface IPostsFetcher {
    /**
     * 最新の投稿を指定された数取得する。
     * @param numberOfPosts 取得する投稿数。
     */
    fetchLatestPosts(numberOfPosts: number): Promise<PostContent[]>;

    /**
     * 指定された投稿ID以降の投稿を指定された数取得する。
     * @param postId 投稿ID。
     * @param numberOfPosts 取得する投稿数。
     */
    fetchPostsById(postId: number, numberOfPosts: number): Promise<PostContent[]>;
}