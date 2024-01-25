/**
 * エンティティのベースインターフェース。
 */
export default interface Entity {
    /**
     * ID。
     */
    readonly id: number;

    /**
     * 作成日時。
     */
    readonly createdAt: Date;
}