/**
 * ユーザー登録を行うためのインターフェース。
 */
export default interface IUserRegistrar {
    /**
     * ユーザーを登録する。
     * @param userName ユーザー名。
     */
    register(userName: string): Promise<boolean>;

    /**
     * ユーザーを削除する。
     * @param id ユーザーID。
     */
    delete(id: string): Promise<boolean>;
}