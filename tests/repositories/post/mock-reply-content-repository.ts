import ReplyContent from "../../../app/models/post/reply-content";
import IReplyContentRepository from "../../../app/repositories/post/i-reply-content-repository";

/**
 * モックのリプライ内容リポジトリ。
 */
export default class MockReplyContentRepository implements IReplyContentRepository {
    public async create(replierId: number, originalPostId: number, originalReplyId: number | null, content: string): Promise<number> {
        if (content === "invalid_content") throw new Error("Invalid content.");
        if (originalReplyId) return 2;
        return 1;
    }
    delete(replyId: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    public async getById(replyId: number): Promise<ReplyContent> {
        return {
            id: 1,
            posterId: 1,
            posterName: "UserName@World",
            originalPostId: 1,
            originalReplyId: 1,
            replyNestingLevel: 0,
            releaseInformationId: 1,
            releaseVersion: "5.5",
            releaseName: "ReleaseName",
            replyCount: 4,
            content: "Content 1",
            createdAt: new Date(),
        };
    }
    public async getAllByPostId(postId: number): Promise<ReplyContent[]> {
        if (postId === 3) throw new Error("Invalid post id.");
        if (postId === 2) {
            const replyContents: ReplyContent[] = Array(500).fill(null).map((_, index) => {
                const incrementedId = index + 1;
                return {
                    id: incrementedId,
                    posterId: 1,
                    posterName: "UserName@World",
                    originalPostId: 1,
                    originalReplyId: incrementedId,
                    replyNestingLevel: incrementedId,
                    releaseInformationId: 1,
                    releaseVersion: "5.5",
                    releaseName: "ReleaseName",
                    replyCount: 2,
                    content: `Content ${incrementedId}`,
                    createdAt: new Date(),
                };
            });
            return replyContents;
        }
        const replyContents: ReplyContent[] = Array(1000).fill(null).map((_, index) => {
            const incrementedId = index + 1;
            return {
                id: incrementedId,
                posterId: 1,
                posterName: "UserName@World",
                originalPostId: 1,
                originalReplyId: incrementedId,
                replyNestingLevel: incrementedId,
                releaseInformationId: 1,
                releaseVersion: "5.5",
                releaseName: "ReleaseName",
                replyCount: 4,
                content: `Content ${incrementedId}`,
                createdAt: new Date(),
            };
        });
        return replyContents;
    }
}