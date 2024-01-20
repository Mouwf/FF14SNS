/**
 * ユーザー登録を行うためのインターフェース。
 */
export default interface IUserRegistrar {
    /**
     * ユーザーを登録する。
     * @param authenticationProviderId 認証プロバイダID。
     * @param userName ユーザー名。
     * @returns 登録に成功したかどうか。
     */
    register(authenticationProviderId: string, userName: string): Promise<boolean>;

    /**
     * ユーザーを削除する。
     * @param id ユーザーID。
     * @returns 削除に成功したかどうか。
     */
    delete(id: number): Promise<boolean>;
}