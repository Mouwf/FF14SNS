import systemMessages from "../../messages/system-messages";
import IUserRepository from "../../repositories/user/i-user-repository";
import ClientUserRegistrationInputErrors from "../../messages/user/client-user-registration-input-errors";
import ProfileIdCreator from "./profile-id-creator";

/**
 * ユーザー登録のバリデーター。
 */
export default class UserRegistrationValidator {
    /**
     * ユーザー登録のバリデーションを行う。
     * @param authenticationProviderId 認証プロバイダID。
     * @param userName ユーザー名。
     * @returns バリデーション結果。
     */
    public static async validate(userRepository: IUserRepository, authenticationProviderId: string, userName: string): Promise<ClientUserRegistrationInputErrors | null> {
        // ユーザー名が既に存在する場合、エラーを投げる。
        const profileId = ProfileIdCreator.create(userName);
        const doesUserExist = await userRepository.existsByProfileId(profileId);
        if (doesUserExist) throw new Error(systemMessages.error.userAlreadyExists);

        // 認証プロバイダIDが不正な場合、エラーを投げる。
        if (!authenticationProviderId) throw new Error(systemMessages.error.authenticationFailed);

        // ユーザー名が不正な場合、エラーメッセージを保持する。
        const userNameErrors: string[] = [];
        if (!userName.match(/^[a-zA-Z0-9]+@{1}[a-zA-Z0-9]+$/)) userNameErrors.push(systemMessages.error.invalidUserName);

        // エラーがない場合、nullを返す。
        if (userNameErrors.length === 0) return null;

        // エラーがある場合、エラーメッセージを返す。
        const clientUserRegistrationInputErrors: ClientUserRegistrationInputErrors = {
            userName: userNameErrors,
        };
        return clientUserRegistrationInputErrors;
    }
}