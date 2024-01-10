/**
 * 投稿内容。
 */
export default interface PostContent {
    /**
     * 投稿ID。
     */
    id: string;

    /**
     * 投稿内容に含まれるリリースバージョン。
     */
    releaseVersion: string;

    /**
     * タグ。
     */
    tag: string;

    /**
     * 投稿日時。
     */
    createdAt: Date;

    /**
     * 投稿内容。
     */
    content: string;
}