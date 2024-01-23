import PostContent from "../../../app/models/post/post-content";
import IPostContentRepository from "../../../app/repositories/post/i-post-content-repository";

/**
 * モックの投稿内容リポジトリ。
 */
export default class MockPostContentRepository implements IPostContentRepository {
    public async create(posterId: number, releaseId: number, content: string): Promise<number> {
        return 1;
    }

    public async delete(postId: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public async getById(postId: number): Promise<PostContent> {
        throw new Error("Method not implemented.");
    }

    public async getLatestLimited(limit: number): Promise<PostContent[]> {
        const postContents: PostContent[] = Array(limit).fill(null).map((_, index) => {
            const incrementedId = index + 1;
            return {
                id: incrementedId,
                posterId: 1,
                posterName: "UserName@World",
                releaseId: 1,
                releaseVersion: "5.5",
                releaseName: "ReleaseName",
                content: `Content ${incrementedId}`,
                createdAt: new Date(),
            };
        });
        return postContents;

    }

    public async getLimitedByPosterId(posterId: number, limit: number): Promise<PostContent[]> {
        throw new Error("Method not implemented.");
    }

    public async getLimitedAfterId(postId: number, limit: number): Promise<PostContent[]> {
        throw new Error("Method not implemented.");
    }
}