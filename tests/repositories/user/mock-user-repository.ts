import User from "../../../app/models/user/user";
import IUserRepository from "../../../app/repositories/user/i-user-repository";

/**
 * ユーザーリポジトリのモック。
 */
export default class MockUserRepository implements IUserRepository {
    create(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    update(user: User): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    findById(id: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    findByProfileId(profileId: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    findByAuthenticationProviderId(authenticationProviderId: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
}