/**
 * ログイン入力エラーを保持するインターフェース。
 */
export default interface LoginInputErrors {
    /**
     * メールアドレスのエラーメッセージ。
     */
    mailAddress: string[];

    /**
     * パスワードのエラーメッセージ。
     */
    password: string[];
}