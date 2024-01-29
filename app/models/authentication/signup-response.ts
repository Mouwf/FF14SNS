/**
 * サインアップのレスポンス。
 */
export default interface SignUpResponse {
    /**
     * 新しく作成されたユーザーの Firebase Auth ID トークン。
     */
    readonly idToken: string;

    /**
     * 新しく作成されたユーザーの電子メール。
     */
    readonly email: string;

    /**
     * 新しく作成されたユーザーの Firebase 認証リフレッシュ トークン。
     */
    readonly refreshToken: string;

    /**
     * ID トークンの有効期限が切れる秒数。
     */
    readonly expiresIn: string;

    /**
     * 新しく作成されたユーザーの uid。
     */
    readonly localId: string;
}