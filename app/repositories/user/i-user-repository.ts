import User from "../../models/user/user";
import UserSetting from "../../models/user/user-setting";

/**
 * ユーザーリポジトリ。
 */
export default interface IUserRepository {
    /**
     * ユーザー、ユーザー設定を作成する。
     * @param profileId プロフィールID。
     * @param authenticationProviderId 認証プロバイダID。
     * @param userName ユーザー名。
     * @param currentReleaseInformationId 現在のリリース情報ID。
     * @returns 登録に成功したかどうか。
     */
    create(profileId: string, authenticationProviderId: string, userName: string, currentReleaseInformationId: number): Promise<boolean>;

    /**
     * ユーザー設定を更新する。
     * @param userSetting ユーザー設定。
     * @returns 更新に成功したかどうか。
     */
    update(userSetting: UserSetting): Promise<boolean>;

    /**
     * ユーザーを削除する。
     * @param id ユーザーID。
     * @returns 削除に成功したかどうか。
     */
    delete(id: number): Promise<boolean>;

    /**
     * 指定されたプロフィールIDのユーザーが存在するかどうか。
     * @param profileId プロフィールID。
     * @returns 存在するかどうか。
     */
    existsByProfileId(profileId: string): Promise<boolean>;

    /**
     * ユーザーIDでユーザーを取得する。
     * @param id ユーザーID。
     * @returns ユーザー。
     */
    findById(id: string): Promise<User | null>;

    /**
     * プロフィールIDでユーザーを取得する。
     * @param profileId プロフィールID。
     * @returns ユーザー。
     */
    findByProfileId(profileId: string): Promise<User | null>;

    /**
     * 認証プロバイダIDでユーザーを取得する。
     * @param authenticationProviderId 認証プロバイダID。
     * @returns ユーザー。
     */
    findByAuthenticationProviderId(authenticationProviderId: string): Promise<User | null>;

    /**
     * プロフィールIDでユーザー設定を取得する。
     * @param profileId プロフィールID。
     * @returns ユーザー設定。
     */
    findUserSettingByProfileId(profileId: string): Promise<UserSetting | null>;
}