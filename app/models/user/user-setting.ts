/**
 * ユーザー設定。
 */
export default interface UserSetting {
    /**
     * ユーザーID。
     */
    userId: number;

    /**
     * ユーザー名。
     */
    userName: string;

    /**
     * タイムラインに表示できる最大リリースID。
     */
    maxVisibleReleaseId: number;
}