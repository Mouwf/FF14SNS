import ReplyContent from "../../../app/models/post/reply-content";
import IReplyContentRepository from "../../../app/repositories/post/i-reply-content-repository";

/**
 * モックのリプライ内容リポジトリ。
 */
export default class MockReplyContentRepository implements IReplyContentRepository {
    create(replierId: number, originalPostId: number, originalReplyId: number | null, content: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(replyId: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getById(replyId: number): Promise<ReplyContent> {
        throw new Error("Method not implemented.");
    }
    getAllByPostId(postId: number): Promise<ReplyContent[]> {
        throw new Error("Method not implemented.");
    }
}