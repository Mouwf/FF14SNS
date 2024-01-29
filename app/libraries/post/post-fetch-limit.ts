/**
 * 投稿取得件数を表すクラス。
 */
export default class PostFetcherLimit {
    /**
     * 投稿取得件数。
     */
    protected readonly postsLimit: number;

    /**
     * 投稿取得件数を定義したクラスを生成する。
     * @param postsLimit 投稿取得件数。
     */
    constructor(postsLimit: number = 1000) {
        this.postsLimit = postsLimit;
    }
}