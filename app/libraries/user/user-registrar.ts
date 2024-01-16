import IUserRegistrar from './i-user-registrar';
import IUserRepository from '../../repositories/user/i-user-repository';

/**
 * ユーザーの登録を行うクラス。
 */
export default class UserRegistrar implements IUserRegistrar {
    /**
     * ユーザーの登録を行うクラスを生成する。
     * @param userRepository ユーザーのリポジトリ。
     */
    constructor(
        private readonly userRepository: IUserRepository,
    ) {
    }

    register(userName: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    delete(id: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}