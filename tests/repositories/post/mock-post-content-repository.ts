import PostContent from "../../../app/models/post/post-content";
import IPostContentRepository from "../../../app/repositories/post/i-post-content-repository";

/**
 * モックの投稿内容リポジトリ。
 */
export default class MockPostContentRepository implements IPostContentRepository {
    create(posterId: number, releaseId: number, content: string): Promise<number> {
        throw new Error("Method not implemented.");
    }

    delete(postId: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getById(postId: number): Promise<PostContent> {
        throw new Error("Method not implemented.");
    }

    getLatestLimited(limit: number): Promise<PostContent[]> {
        throw new Error("Method not implemented.");
    }

    getLimitedByPosterId(posterId: number, limit: number): Promise<PostContent[]> {
        throw new Error("Method not implemented.");
    }

    getLimitedAfterId(postId: number, limit: number): Promise<PostContent[]> {
        throw new Error("Method not implemented.");
    }
}