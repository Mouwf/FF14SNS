/**
 * ユーザー設定。
 */
export default interface UserSetting {
    /**
     * ユーザーID。
     */
    readonly userId: string;

    /**
     * ユーザー名。
     */
    readonly userName: string;

    /**
     * 現在のリリース情報ID。
     */
    readonly currentReleaseInformationId: number;
}