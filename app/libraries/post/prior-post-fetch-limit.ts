import PostFetchLimit from './post-fetch-limit';

/**
 * 以前の投稿取得件数を表すクラス。
 */
export default class PriorPostFetchLimit extends PostFetchLimit {
    /**
     * 以前の投稿取得件数を定義したクラスを生成する。
     */
    constructor() {
        super(100);
    }
}