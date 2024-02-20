import AuthenticationValidator from './authentication-validator';
import LoginInputErrors from '../../messages/authentication/login-input-errors';

/**
 * ログインのバリデーションを行うクラス。
 */
export default class LoginValidator extends AuthenticationValidator {
    /**
     * ログインのバリデーションを行う。
     * @param mailAddress メールアドレス。
     * @param password パスワード。
     * @returns バリデーション結果。
     */
    public static validate(mailAddress: string, password: string): LoginInputErrors | null {
        // 無効なメールアドレスの場合、エラーメッセージを保持する。
        const mailAddressErrors: string[] = AuthenticationValidator.validateMailAddress(mailAddress);

        // パスワードの長さが8文字未満、英数字が含まれていない場合、エラーメッセージを保持する。
        const passwordErrors: string[] = AuthenticationValidator.validatePassword(password);

        // エラーがない場合、nullを返す。
        if (mailAddressErrors.length === 0 && passwordErrors.length === 0) return null;

        // エラーがある場合、エラーメッセージを返す。
        const loginInputErrors: LoginInputErrors = {
            mailAddress: mailAddressErrors,
            password: passwordErrors,
        };
        return loginInputErrors;
    }
}