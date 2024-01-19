import User from "../../../app/models/user/user";
import IUserRepository from "../../../app/repositories/user/i-user-repository";

/**
 * ユーザーリポジトリのモック。
 */
export default class MockUserRepository implements IUserRepository {
    public async create(profileId: string, authenticationProviderId: string, userName: string): Promise<boolean> {
        return true;
    }

    update(user: User): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public async delete(id: number): Promise<boolean> {
        if (id !== 1) return false;
        return true;
    }

    findById(id: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    findByProfileId(profileId: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    public async findByAuthenticationProviderId(authenticationProviderId: string): Promise<User | null> {
        if (authenticationProviderId !== "authenticationProviderId") return null;
        const user = {
            id: 1,
            profileId: "profileId",
            authenticationProviderId: "authenticationProviderId",
            userName: "UserName@World",
            createdAt: new Date(),
        };
        return user;
    }
}