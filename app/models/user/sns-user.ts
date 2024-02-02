/**
 * SNSのユーザー。
 */
export default interface SnsUser {
    /**
     * ユーザーID。
     */
    readonly userId: string;

    /**
     * ユーザー名。
     */
    readonly userName: string;

    /**
     * 現在のリリースバージョン。
     */
    readonly currentReleaseVersion: string;

    /**
     * 現在のリリース名。
     */
    readonly currentReleaseName: string;
}