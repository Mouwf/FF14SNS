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
        const splitUserName = userName.split("@");
        const profileId = (splitUserName[0] + "_" + splitUserName[1]).toLowerCase();
        return profileId;
    }
}