/**
 * 認証ユーザー登録の入力エラーを保持するインターフェース。
 */
export default interface AuthenticationUserRegistrationInputErrors {
    /**
     * メールアドレスのエラーメッセージ。
     */
    mailAddress: string[];

    /**
     * パスワードのエラーメッセージ。
     */
    password: string[];
}