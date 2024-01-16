import User from '../../models/user/user';
import IUserRepository from './i-user-repository';

/**
 * Postgresのユーザーのリポジトリ。
 */
export default class PostgresUserRepository implements IUserRepository {
    create(): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    update(user: User): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    delete(id: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    findById(id: string): Promise<User | null> {
        throw new Error('Method not implemented.');
    }

    findByProfileId(profileId: string): Promise<User | null> {
        throw new Error('Method not implemented.');
    }

    findByAuthenticationProviderId(authenticationProviderId: string): Promise<User | null> {
        throw new Error('Method not implemented.');
    }
}