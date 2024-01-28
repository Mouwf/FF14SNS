import IUserRepository from "../../repositories/user/i-user-repository";
import UserRegistrationValidator from "./user-registration-validator";
import ProfileIdCreator from "./profile-id-creator";

/**
 * ユーザー登録を行うクラス。
 */
export default class UserRegistrar {
    /**
     * ユーザーの登録を行うクラスを生成する。
     * @param userRepository ユーザーリポジトリ。
     */
    constructor(
        private readonly userRepository: IUserRepository,
    ) {
    }

    /**
     * ユーザーを登録する。
     * @param authenticationProviderId 認証プロバイダID。
     * @param userName ユーザー名。
     * @returns 登録に成功したかどうか。
     */
    public async register(authenticationProviderId: string, userName: string): Promise<boolean> {
        // ユーザー登録バリデーションを行う。
        UserRegistrationValidator.validate(authenticationProviderId, userName);

        // ユーザーを登録する。
        const profileId = ProfileIdCreator.create(userName);
        const response = await this.userRepository.create(profileId, authenticationProviderId, userName);
        return response;
    }

    /**
     * ユーザーを削除する。
     * @param id ユーザーID。
     * @returns 削除に成功したかどうか。
     */
    public async delete(id: number): Promise<boolean> {
        const response = await this.userRepository.delete(id);
        return response;
    }
}