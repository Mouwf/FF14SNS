/**
 * プロバイダーユーザー情報。
 */
export default interface ProviderUserInformation {
    /**
     * プロバイダーのID。
     */
    providerId: string;

    /**
     * アカウントの表示名。
     */
    displayName: string;

    /**
     * アカウントの写真の URL。
     */
    photoUrl: string;

    /**
     * 外部認証プロバイダーのユーザーID。
     */
    federatedId: string;

    /**
     * アカウントのメールアドレス。
     */
    email: string;

    /**
     * 生のID。
     */
    rawId: string;

    /**
     * 表示名。
     */
    screenName: string;
}