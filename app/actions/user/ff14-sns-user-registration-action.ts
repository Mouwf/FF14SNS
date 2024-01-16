import IUserRegistrar from "../../libraries/user/i-user-registrar";

/**
 * FF14SNSのユーザー登録を行うアクション。
 */
export default class FF14SnsUserRegistrationAction {
    /**
     * FF14SNSのユーザー登録を行うアクションを生成する。
     * @param userRegistrar ユーザー登録を行うクラス。
     */
    constructor(
        private readonly userRegistrar: IUserRegistrar,
    ) {
    }

    /**
     * ユーザーを登録する。
     * @returns 登録に成功したかどうか。
     */
    public async register(): Promise<boolean> {
        const response = await this.userRegistrar.register();
        return response;
    }

    /**
     * ユーザーを削除する。
     * @param id ユーザーID。
     * @returns 削除に成功したかどうか。
     */
    public async delete(id: string): Promise<boolean> {
        const response = await this.userRegistrar.delete(id);
        return response;
    }
}