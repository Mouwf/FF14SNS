/**
 * プロバイダーユーザー情報。
 */
export default interface ProviderUserInformation {
    /**
     * プロバイダーのID。
     */
    readonly providerId: string;

    /**
     * アカウントの表示名。
     */
    readonly displayName: string;

    /**
     * アカウントの写真の URL。
     */
    readonly photoUrl: string;

    /**
     * 外部認証プロバイダーのユーザーID。
     */
    readonly federatedId: string;

    /**
     * アカウントのメールアドレス。
     */
    readonly email: string;

    /**
     * 生のID。
     */
    readonly rawId: string;

    /**
     * 表示名。
     */
    readonly screenName: string;
}