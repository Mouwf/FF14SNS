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
}