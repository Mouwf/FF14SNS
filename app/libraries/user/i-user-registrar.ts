/**
 * ユーザー登録を行うためのインターフェース。
 */
export default interface IUserRegistrar {
    /**
     * ユーザーを登録する。
     */
    register(): Promise<boolean>;

    /**
     * ユーザーを削除する。
     * @param id ユーザーID。
     */
    delete(id: string): Promise<boolean>;
}