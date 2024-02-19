import systemMessages from "../../messages/system-messages";

/**
 * サインアップのバリデーションを行うクラス。
 */
export default class SignUpValidator {
    /**
     * サインアップのバリデーションを行う。
     * @param password パスワード。
     * @param confirmPassword 再確認パスワード。
     * @returns バリデーション結果。
     * @throws バリデーションに失敗した場合、エラーを投げる。
     */
    public static validate(password: string, confirmPassword: string): boolean {
        // パスワードの長さが8文字未満、英数字が含まれていない場合、エラーを投げる。
        if (password.length < 8 || !password.match(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i)) throw new Error(systemMessages.error.invalidPasswordOnSetting);

        // パスワードと再確認パスワードが一致しない場合、エラーを返す。
        if (password !== confirmPassword) throw new Error(systemMessages.error.passwordMismatch);
        return true;
    }
}