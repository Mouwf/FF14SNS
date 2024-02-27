import PostContent from "../../models/post/post-content";

/**
 * 投稿内容リポジトリ。
 */
export default interface IPostContentRepository {
    /**
     * 投稿を作成する。
     * @param posterId 投稿者ID。
     * @param releaseInformationId 投稿に関連するリリース情報ID。
     * @param content 投稿内容。
     * @returns 投稿ID。
     */
    create(posterId: number, releaseInformationId: number, content: string): Promise<number>;

    /**
     * 投稿を削除する。
     * @param postId 投稿ID。
     */
    delete(postId: number): Promise<boolean>;

    /**
     * 投稿IDで投稿を取得する。
     * @param postId 投稿ID。
     */
    getById(postId: number): Promise<PostContent>;

    /**
     * ユーザーが設定したリリースバージョン以下の最新の投稿を指定された数取得する。
     * @param profileId プロフィールID。
     * @param limit 取得する投稿数。
     */
    getLatestLimited(profileId: string, limit: number): Promise<PostContent[]>;

    /**
     * ユーザーが設定したリリースバージョン以下の投稿ID以降の投稿を指定された数取得する。
     * @param profileId プロフィールID。
     * @param postId 投稿ID。
     * @param limit 取得する投稿数。
     */
    getLimitedAfterId(profileId: string, postId: number, limit: number): Promise<PostContent[]>;

    /**
     * 投稿者IDで指定された数の投稿を取得する。
     * @param posterId 投稿者ID。
     * @param limit 取得する投稿数。
     */
    getLimitedByPosterId(posterId: number, limit: number): Promise<PostContent[]>;
}