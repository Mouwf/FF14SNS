/**
 * メールアドレスとパスワードでサインインのレスポンス。
 */
export default interface SignInWithEmailPasswordResponse {
    /**
     * アカウントの表示名。
     */
    readonly displayName: string;

    /**
     * 認証されたユーザーの Firebase Auth ID トークン。
     */
    readonly idToken: string;

    /**
     * 認証されたユーザーの電子メール。
     */
    readonly email: string;

    /**
     * 認証されたユーザーの Firebase 認証リフレッシュ トークン。
     */
    readonly refreshToken: string;

    /**
     * ID トークンの有効期限が切れる秒数。
     */
    readonly expiresIn: string;

    /**
     * 認証されたユーザーの uid。
     */
    readonly localId: string;

    /**
     * 電子メールが既存のアカウントに対するものであるかどうか。
     */
    readonly registered: boolean;
}