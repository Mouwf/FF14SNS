import IUserRegistrar from "../../libraries/authentication/i-user-registrar";
import SignUpResponse from "../../models/firebase/signup-response";

/**
 * ユーザー登録を行うアクション。
 */
export default class UserRegistrationAction {
    /**
     * ユーザー登録を行うアクションを生成する。
     * @param userRegistrar ユーザー登録を行うクラス。
     */
    constructor(private readonly userRegistrar: IUserRegistrar) {
    }

    /**
     * ユーザーを登録する。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @returns サインアップのレスポンス。
     */
    public async register(mailAddress: string, password: string): Promise<SignUpResponse> {
        const response = await this.userRegistrar.register(mailAddress, password);
        return response;
    }

    /**
     * ユーザーを削除する。
     * @param mailAddress メールアドレス。
     * @returns 削除に成功したかどうか。
     */
    public delete(mailAddress: string): Promise<boolean> {
        const response = this.userRegistrar.delete(mailAddress);
        return response;
    }
}
