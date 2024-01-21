import Entity from '../common/entity';

/**
 * 投稿内容。
 */
export default interface PostContent extends Entity {
    /**
     * 投稿者ID。
     */
    readonly posterId: number;

    /**
     * 投稿者名。
     */
    readonly posterName: string;

    /**
     * 投稿に関連するリリース情報ID。
     */
    readonly releaseId: number;

    /**
     * 投稿に関連するリリースバージョン。
     */
    readonly releaseVersion: string;

    /**
     * 投稿に関連するリリース名。
     */
    readonly releaseName: string;

    /**
     * 投稿内容。
     */
    readonly content: string;
}