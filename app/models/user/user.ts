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
}