import systemMessages from "../../messages/system-messages";
import IUserRepository from "../../repositories/user/i-user-repository";
import UserRegistrationValidator from "./user-registration-validator";
import ProfileIdCreator from "./profile-id-creator";
import UserSetting from "../../models/user/user-setting";

/**
 * ユーザー情報の管理を行うクラス。
 */
export default class UserProfileManager {
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
     * @param currentReleaseInformationId 現在のリリース情報ID。
     */
    public async register(authenticationProviderId: string, userName: string, currentReleaseInformationId: number): Promise<void> {
        try {
            // ユーザー登録のバリデーションを行う。
            UserRegistrationValidator.validate(authenticationProviderId, userName);

            // ユーザーを登録する。
            const profileId = ProfileIdCreator.create(userName);
            const response = await this.userRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId);
            if (!response) throw new Error(systemMessages.error.userRegistrationFailed);
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.userRegistrationFailed);
        }
    }

    /**
     * ユーザー設定を更新する。
     * @param userSetting ユーザー設定。
     */
    public async editUserSetting(userSetting: UserSetting): Promise<void> {
        try {
            const response = await this.userRepository.update(userSetting);
            if (!response) throw new Error(systemMessages.error.userSettingEditFailed);
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.userSettingEditFailed);
        }
    }

    /**
     * ユーザーを削除する。
     * @param id ユーザーID。
     */
    public async delete(id: number): Promise<void> {
        try {
            const response = await this.userRepository.delete(id);
            if (!response) throw new Error(systemMessages.error.userDeletionFailed);
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.userDeletionFailed);
        }
    }

    /**
     * プロフィールIDからユーザー設定を取得する。
     * @param profileId プロフィールID。
     * @returns ユーザー設定。
     */
    public async fetchUserSettingByProfileId(profileId: string): Promise<UserSetting> {
        try {
            const response = await this.userRepository.findUserSettingByProfileId(profileId);
            if (response == null) throw new Error(systemMessages.error.userSettingRetrievalFailed);
            return response;
        } catch (error) {
            console.error(error);
            if (error instanceof TypeError) throw new Error(systemMessages.error.networkError);
            throw new Error(systemMessages.error.userSettingRetrievalFailed);
        }
    }
}