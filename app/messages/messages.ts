/**
 * メッセージを保持するインターフェース。
 */
export default interface Messages {
    /**
     * エラーメッセージ。
     */
    error: {
        [key: string]: string;
    };

    /**
     * 成功メッセージ。
     */
    success: {
        [key: string]: string;
    };
}