import User from "../../models/user/user";

/**
 * ユーザーリポジトリ。
 */
export default interface IUserRepository {
    /**
     * ユーザーを作成する。
     * @param profileId プロフィールID。
     * @param authenticationProviderId 認証プロバイダID。
     * @param userName ユーザー名。
     * @returns 登録に成功したかどうか。
     */
    create(profileId: string, authenticationProviderId: string, userName: string): Promise<boolean>;

    /**
     * ユーザーを更新する。
     * @param user ユーザー。
     */
    update(user: User): Promise<boolean>;

    /**
     * ユーザーを削除する。
     * @param id ユーザーID。
     */
    delete(id: number): Promise<boolean>;

    /**
     * ユーザーIDでユーザーを取得する。
     * @param id ユーザーID。
     */
    findById(id: string): Promise<User | null>;

    /**
     * プロフィールIDでユーザーを取得する。
     * @param profileId プロフィールID。
     */
    findByProfileId(profileId: string): Promise<User | null>;

    /**
     * 認証プロバイダIDでユーザーを取得する。
     * @param authenticationProviderId 認証プロバイダID。
     */
    findByAuthenticationProviderId(authenticationProviderId: string): Promise<User | null>;
}