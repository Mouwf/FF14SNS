import ProviderUserInformation from './provider-user-information';

/**
 * ユーザー情報。
 */
export default interface UserInformation {
    /**
     * 現在のユーザーの uid。
     */
    localId: string;

    /**
     * アカウントのメールアドレス。
     */
    email: string;

    /**
     * アカウントのメールアドレスが認証されているかどうか。
     */
    emailVerified: boolean;

    /**
     * アカウントの表示名。
     */
    displayName: string;

    /**
     * 「providerId」と「federatedId」を含むすべてのリンクされたプロバイダー オブジェクトのリスト。
     */
    providerUserInfo: ProviderUserInformation[];

    /**
     * アカウントの写真の URL。
     */
    photoUrl: string;

    /**
     * パスワードのハッシュバージョン。
     */
    passwordHash: string;

    /**
     * アカウントのパスワードが最後に変更されたタイムスタンプ (ミリ秒単位)。
     */
    passwordUpdatedAt: number;

    /**
     * Firebase ID トークンが取り消されたと見なされるまでの境界を示すタイムスタンプ (秒単位)。
     */
    validSince: string;

    /**
     * アカウントが無効になっているかどうか。
     */
    disabled: boolean;

    /**
     * アカウントが最後にログインしたときのタイムスタンプ (ミリ秒単位)。
     */
    lastLoginAt: string;

    /**
     * アカウントが作成されたタイムスタンプ (ミリ秒単位)。
     */
    createdAt: string;

    /**
     * アカウントが開発者によって認証されているかどうか。
     */
    customAuth: boolean;
}