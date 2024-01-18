/**
 * ユーザー登録のバリデーター。
 */
export default class UserRegistrationValidator {
    /**
     * ユーザー登録のバリデーションを行う。
     * @param authenticationProviderId 認証プロバイダID。
     * @param userName ユーザー名。
     * @returns バリデーション結果。
     * @throws バリデーションに失敗した場合、エラーを投げる。
     */
    public static validate(authenticationProviderId: string, userName: string): boolean {
        // 認証プロバイダIDが不正な場合、エラーを投げる。
        if (!authenticationProviderId) throw new Error("認証プロバイダIDは必須です。");

        // ユーザー名が不正な場合、エラーを投げる。
        const regex = /^[a-zA-Z0-9]*@{1}[a-zA-Z0-9]*$/;
        if (!regex.test(userName)) throw new Error("ユーザー名は「username@world」で入力してください。");

        // バリデーションを通過した場合、trueを返す。
        return true;
    }
}