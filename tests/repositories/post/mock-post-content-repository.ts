import PostContent from "../../../app/models/post/post-content";
import IPostContentRepository from "../../../app/repositories/post/i-post-content-repository";

/**
 * モックの投稿内容リポジトリ。
 */
export default class MockPostContentRepository implements IPostContentRepository {
    public async create(posterId: number, releaseInformationId: number, content: string): Promise<number> {
        if (content === "invalid_content") throw new Error("Invalid content.");
        return 1;
    }

    public async delete(postId: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public async getById(postId: number): Promise<PostContent> {
        throw new Error("Method not implemented.");
    }

    public async getLatestLimited(profileId: string, limit: number): Promise<PostContent[]> {
        if (profileId === "invalid_profile_id") throw new Error("Invalid profile id.");
        if (profileId !== "username_world1") {
            const postContents: PostContent[] = Array(500).fill(null).map((_, index) => {
                const incrementedId = index + 1;
                return {
                    id: incrementedId,
                    posterId: 1,
                    posterName: "UserName@World",
                    releaseInformationId: 1,
                    releaseVersion: "5.5",
                    releaseName: "ReleaseName",
                    content: `Content ${incrementedId}`,
                    createdAt: new Date(),
                };
            });
            return postContents;
        }
        const postContents: PostContent[] = Array(limit).fill(null).map((_, index) => {
            const incrementedId = index + 1;
            return {
                id: incrementedId,
                posterId: 1,
                posterName: "UserName@World",
                releaseInformationId: 1,
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

    public async getLimitedAfterId(profileId: string, postId: number, limit: number): Promise<PostContent[]> {
        throw new Error("Method not implemented.");
    }
}