/**
 * エンティティのベースインターフェース。
 */
export default interface Entity {
    /**
     * ID。
     */
    id: string;

    /**
     * 作成日時。
     */
    createdAt: Date;
}