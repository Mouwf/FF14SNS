import Entity from '../common/entity';

/**
 * ユーザー。
 */
export default interface User extends Entity {
    /**
     * プロフィールID。
     */
    readonly profileId: string;

    /**
     * 認証プロバイダID。
     */
    readonly authenticationProviderId: string;

    /**
     * ユーザー名。
     */
    readonly userName: string;

    /**
     * 現在のリリースバージョン。
     */
    readonly currentReleaseVersion: string;

    /**
     * 現在のリリース名。
     */
    readonly currentReleaseName: string;
}