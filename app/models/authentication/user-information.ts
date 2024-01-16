import ProviderUserInformation from './provider-user-information';

/**
 * ユーザー情報。
 */
export default interface UserInformation {
    /**
     * 現在のユーザーの uid。
     */
    readonly localId: string;

    /**
     * アカウントのメールアドレス。
     */
    readonly email: string;

    /**
     * アカウントのメールアドレスが認証されているかどうか。
     */
    readonly emailVerified: boolean;

    /**
     * アカウントの表示名。
     */
    readonly displayName: string;

    /**
     * 「providerId」と「federatedId」を含むすべてのリンクされたプロバイダー オブジェクトのリスト。
     */
    readonly providerUserInfo: ProviderUserInformation[];

    /**
     * アカウントの写真の URL。
     */
    readonly photoUrl: string;

    /**
     * パスワードのハッシュバージョン。
     */
    readonly passwordHash: string;

    /**
     * アカウントのパスワードが最後に変更されたタイムスタンプ (ミリ秒単位)。
     */
    readonly passwordUpdatedAt: number;

    /**
     * Firebase ID トークンが取り消されたと見なされるまでの境界を示すタイムスタンプ (秒単位)。
     */
    readonly validSince: string;

    /**
     * アカウントが無効になっているかどうか。
     */
    readonly disabled: boolean;

    /**
     * アカウントが最後にログインしたときのタイムスタンプ (ミリ秒単位)。
     */
    readonly lastLoginAt: string;

    /**
     * アカウントが作成されたタイムスタンプ (ミリ秒単位)。
     */
    readonly createdAt: string;

    /**
     * アカウントが開発者によって認証されているかどうか。
     */
    readonly customAuth: boolean;
}