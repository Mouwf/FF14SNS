/**
 * メールアドレスとパスワードでサインインのレスポンス。
 */
export default interface SignInWithEmailPasswordResponse {
    /**
     * アカウントの表示名。
     */
    displayName: string;

    /**
     * 認証されたユーザーの Firebase Auth ID トークン。
     */
    idToken: string;

    /**
     * 認証されたユーザーの電子メール。
     */
    email: string;

    /**
     * 認証されたユーザーの Firebase 認証リフレッシュ トークン。
     */
    refreshToken: string;

    /**
     * ID トークンの有効期限が切れる秒数。
     */
    expiresIn: string;

    /**
     * 認証されたユーザーの uid。
     */
    localId: string;

    /**
     * 電子メールが既存のアカウントに対するものであるかどうか。
     */
    registered: boolean;
}