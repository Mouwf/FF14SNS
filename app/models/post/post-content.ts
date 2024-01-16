import Entity from '../common/entity';

/**
 * 投稿内容。
 */
export default interface PostContent extends Entity {
    /**
     * 投稿内容に含まれるリリースバージョン。
     */
    readonly releaseVersion: string;

    /**
     * タグ。
     */
    readonly tag: string;

    /**
     * 投稿内容。
     */
    readonly content: string;
}