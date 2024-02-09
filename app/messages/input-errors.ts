/**
 * 入力エラーのメッセージを保持するインターフェース。
 */
export default interface InputErrors {
    /**
     * エラーメッセージ。
     */
    error: {
        [key: string]: string;
    };
}