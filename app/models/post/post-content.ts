import Entity from '../common/entity';

/**
 * 投稿内容。
 */
export default interface PostContent extends Entity {
    /**
     * 投稿内容に含まれるリリースバージョン。
     */
    releaseVersion: string;

    /**
     * タグ。
     */
    tag: string;

    /**
     * 投稿内容。
     */
    content: string;
}