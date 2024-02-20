import systemMessages from "../../messages/system-messages";

/**
 * 認証のバリデーションを行うクラス。
 */
export default class AuthenticationValidator {
    /**
     * メールアドレスのバリデーションを行う。
     * @param mailAddress メールアドレス。
     * @returns エラーメッセージ。
     */
    protected static validateMailAddress(mailAddress: string): string[] {
        const mailAddressErrors: string[] = [];
        if (!mailAddress.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) mailAddressErrors.push(systemMessages.error.invalidMailAddress);
        return mailAddressErrors;
    }

    /**
     * パスワードのバリデーションを行う。
     * @param password パスワード。
     * @returns エラーメッセージ。
     */
    protected static validatePassword(password: string): string[] {
        const passwordErrors: string[] = [];
        if (password.length < 8 || !password.match(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i)) passwordErrors.push(systemMessages.error.invalidPasswordOnSetting);
        return passwordErrors;
    }
}