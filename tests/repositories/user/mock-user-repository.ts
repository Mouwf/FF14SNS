import User from "../../../app/models/user/user";
import UserSetting from "../../../app/models/user/user-setting";
import IUserRepository from "../../../app/repositories/user/i-user-repository";

/**
 * ユーザーリポジトリのモック。
 */
export default class MockUserRepository implements IUserRepository {
    public async create(profileId: string, authenticationProviderId: string, userName: string): Promise<boolean> {
        if (userName === "errorUserName@World") return false;
        return true;
    }

    public async update(userSetting: UserSetting): Promise<boolean> {
        if (userSetting.userId === "username_world2") throw new Error("ユーザーが存在しません。");
        if (userSetting.userId !== "username_world1") return false;
        return true;
    }

    public async delete(id: number): Promise<boolean> {
        if (id !== 1) return false;
        return true;
    }

    public async findById(id: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

    public async findByProfileId(profileId: string): Promise<User | null> {
        if (profileId === "invalidProfileId") throw new Error("Invalid profileId.");
        if (profileId !== "username_world1") return null;
        const user = {
            id: 1,
            profileId: "username_world1",
            authenticationProviderId: "authenticationProviderId",
            userName: "UserName@World",
            currentReleaseVersion: "1.0",
            currentReleaseName: "Hello, World!",
            createdAt: new Date(),
        };
        return user;
    }

    public async findByAuthenticationProviderId(authenticationProviderId: string): Promise<User | null> {
        if (authenticationProviderId !== "authenticationProviderId") return null;
        const user = {
            id: 1,
            profileId: "username_world1",
            authenticationProviderId: "authenticationProviderId",
            userName: "UserName@World",
            currentReleaseVersion: "1.0",
            currentReleaseName: "Hello, World!",
            createdAt: new Date(),
        };
        return user;
    }

    public async findUserSettingByProfileId(profileId: string): Promise<UserSetting | null> {
        if (profileId !== "username_world1") return null;
        const userSetting = {
            userId: "username_world1",
            userName: "UserName@World1",
            currentReleaseInformationId: 1,
        };
        return userSetting;
    }
}