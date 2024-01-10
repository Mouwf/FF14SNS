import PostContent from "../../models/post/post-content";

/**
 * 最新の投稿を取得するローダー。
 */
export default class LatestPostsLoader {
    /**
     * 最新の投稿を取得する。
     * @param id 投稿ID。
     * @returns 最新の投稿。
     */
    public async getLatestPosts(id: string): Promise<PostContent[]> {
        const idNumber = Number(id) + 1;
        const postContents: PostContent[] = Array.from({
            length: 10,
        }, (_, i) => {
            const incrementedId = i + idNumber;
            const content = `
                これはポスト${incrementedId}のテストです。\n
                これはポスト${incrementedId}のテストです。\n
                これはポスト${incrementedId}のテストです。\n
                これはポスト${incrementedId}のテストです。\n
                これはポスト${incrementedId}のテストです。\n
            `;

            return ({
                id: incrementedId.toString(),
                releaseVersion: "5.5",
                tag: "考察",
                createdAt: new Date(),
                content: content,
            });
        });
        return postContents;
    }
}