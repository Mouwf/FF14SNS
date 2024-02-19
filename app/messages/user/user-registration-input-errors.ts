/**
 * 入力エラーのメッセージを保持するインターフェース。
 */
export default interface UserRegistrationInputErrors {
    /**
     * ユーザー名に関するエラーメッセージ。
     */
    userName: string[];
}