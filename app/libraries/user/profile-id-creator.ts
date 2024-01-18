/**
 * プロフィールIDを生成するクラス。
 */
export default class ProfileIdCreator {
    /**
     * ユーザー名からプロフィールIDを生成する。
     * @param userName ユーザー名。
     * @returns プロフィールID。
     */
    public static create(userName: string): string {
        // ユーザー名が不正な場合、エラーを投げる。
        const regex = /^[a-zA-Z0-9]*@{1}[a-zA-Z0-9]*$/;
        if (!regex.test(userName)) throw new Error("ユーザー名は「username@world」で入力してください。");

        // プロフィールIDを生成する。
        const splitUserName = userName.split("@");
        const profileId = (splitUserName[0] + "_" + splitUserName[1]).toLowerCase();

        // プロフィールIDを返す。
        return profileId;
    }
}