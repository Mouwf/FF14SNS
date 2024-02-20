import systemMessages from "../../messages/system-messages";
import ClientUserRegistrationInputErrors from "../../messages/user/client-user-registration-input-errors";

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
    public static validate(authenticationProviderId: string, userName: string): ClientUserRegistrationInputErrors | null {
        // 認証プロバイダIDが不正な場合、エラーを投げる。
        if (!authenticationProviderId) throw new Error(systemMessages.error.authenticationFailed);

        // ユーザー名が不正な場合、エラーメッセージを保持する。
        const userNameErrors: string[] = [];
        if (!userName.match(/^[a-zA-Z0-9]*@{1}[a-zA-Z0-9]*$/)) userNameErrors.push(systemMessages.error.invalidUserName);

        // エラーがない場合、nullを返す。
        if (userNameErrors.length === 0) return null;

        // エラーがある場合、エラーメッセージを返す。
        const clientUserRegistrationInputErrors: ClientUserRegistrationInputErrors = {
            userName: userNameErrors,
        };
        return clientUserRegistrationInputErrors;
    }
}