/**
 * メッセージを投稿するインターフェース。
 */
export default interface IPoster {
    /**
     * メッセージを投稿する。
     * @param posterId 投稿者ID。
     * @param releaseId 投稿に関連するリリース情報ID。
     * @param content 投稿内容。
     * @returns 投稿ID。
     */
    post(posterId: number, releaseId: number, content: string): Promise<number>;
}