import Entity from '../common/entity';

/**
 * リプライ内容。
 */
export default interface ReplyContent extends Entity {
    /**
     * 投稿者ID。
     */
    readonly posterId: number;

    /**
     * 投稿者名。
     */
    readonly posterName: string;

    /**
     * リプライ先投稿ID。
     */
    readonly originalPostId: number;

    /**
     * リプライ先リプライID。
     */
    readonly originalReplyId: number | null;

    /**
     * 返信のネストレベル。
     */
    readonly replyNestingLevel: number;

    /**
     * リプライ内容。
     */
    readonly content: string;
}