import Entity from '../common/entity';

/**
 * 認証済みユーザー。
 */
export default interface AuthenticatedUser extends Entity {
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
}