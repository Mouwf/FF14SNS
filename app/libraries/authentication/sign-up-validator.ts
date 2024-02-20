import systemMessages from "../../messages/system-messages";
import AuthenticationUserRegistrationInputErrors from "../../messages/authentication/authentication-user-registration-input-errors";
import AuthenticationValidator from "./authentication-validator";

/**
 * サインアップのバリデーションを行うクラス。
 */
export default class SignUpValidator extends AuthenticationValidator {
    /**
     * サインアップのバリデーションを行う。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @param confirmPassword 再確認パスワード。
     * @returns バリデーション結果。
     */
    public static validate(mailAddress: string, password: string, confirmPassword: string): AuthenticationUserRegistrationInputErrors | null {
        // 無効なメールアドレスの場合、エラーメッセージを保持する。
        const mailAddressErrors: string[] = AuthenticationValidator.validateMailAddress(mailAddress);

        // パスワードの長さが8文字未満、英数字が含まれていない場合、エラーメッセージを保持する。
        const passwordErrors: string[] = AuthenticationValidator.validatePassword(password);

        // パスワードと再確認パスワードが一致しない場合、エラーメッセージを保持する。
        if (password !== confirmPassword) passwordErrors.push(systemMessages.error.passwordMismatch);

        // エラーがない場合、nullを返す。
        if (mailAddressErrors.length === 0 && passwordErrors.length === 0) return null;

        // エラーがある場合、エラーメッセージを返す。
        const userRegistrationInputErrors: AuthenticationUserRegistrationInputErrors = {
            mailAddress: mailAddressErrors,
            password: passwordErrors,
        };
        return userRegistrationInputErrors;
    }
}