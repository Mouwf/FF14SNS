import IUserRegistrar from "./i-user-registrar";
import IUserRepository from "../../repositories/user/i-user-repository";
import ProfileIdCreator from "./profile-id-creator";

/**
 * ユーザーの登録を行うクラス。
 */
export default class UserRegistrar implements IUserRegistrar {
    /**
     * ユーザーの登録を行うクラスを生成する。
     * @param userRepository ユーザーリポジトリ。
     */
    constructor(
        private readonly userRepository: IUserRepository,
    ) {
    }

    public async register(authenticationProvidedId: string, userName: string): Promise<boolean> {
        const profileId = ProfileIdCreator.create(userName);
        const response = await this.userRepository.create(profileId, authenticationProvidedId, userName);
        return response;
    }

    public async delete(id: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}