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
        const idNumber = Number(id);
        const postContents: PostContent[] = Array.from({
            length: 10,
        }, (_, i) => {
            const incrementedId = i + 1 + idNumber;

            return ({
                id: incrementedId.toString(),
                releaseVersion: "5.5",
                tag: "考察",
                createdAt: new Date(),
                content: `これは${incrementedId}のテストです。これは${incrementedId}のテストです。これは${incrementedId}のテストです。これは${incrementedId}のテストです。これは${incrementedId}のテストです。\nこれは${incrementedId}のテストです。これは${incrementedId}のテストです。これは${incrementedId}のテストです。`,
            });
        });
        return postContents;
    }
}