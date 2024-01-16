/**
 * サインアップのレスポンス。
 */
export default interface SignUpResponse {
    /**
     * 新しく作成されたユーザーの Firebase Auth ID トークン。
     */
    idToken: string;

    /**
     * 新しく作成されたユーザーの電子メール。
     */
    email: string;

    /**
     * 新しく作成されたユーザーの Firebase 認証リフレッシュ トークン。
     */
    refreshToken: string;

    /**
     * ID トークンの有効期限が切れる秒数。
     */
    expiresIn: string;

    /**
     * 新しく作成されたユーザーの uid。
     */
    localId: string;
}