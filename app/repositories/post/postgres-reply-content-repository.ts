import PostgresClientProvider from "../common/postgres-client-provider";
import ReplyContent from "../../models/post/reply-content";
import IReplyContentRepository from "./i-reply-content-repository";

/**
 * Postgresのリプライ内容リポジトリ。
 */
export default class PostgresReplyContentRepository implements IReplyContentRepository {
    /**
     * Postgresのリプライ内容リポジトリを生成する。
     * @param postgresClientProvider Postgresクライアントプロバイダー。
     */
    constructor(
        private readonly postgresClientProvider: PostgresClientProvider,
    ) {
    }

    public async create(replierId: number, originalPostId: number, originalReplyId: number | null, content: string): Promise<void> {
        // ここにリプライを作成する処理を実装する。
    }

    public async delete(replyId: number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public async getById(replyId: number): Promise<ReplyContent> {
        const replyContent = {
            id: replyId,
            posterId: 1,
            posterName: "UserName@World",
            originalPostId: 1,
            originalReplyId: 1,
            replyNestingLevel: 1,
            releaseInformationId: 1,
            releaseVersion: "1.0.0",
            releaseName: "Mock Release",
            content: "Mock content",
            createdAt: new Date(),
        };
        return replyContent;
    }

    public async getAllByPostId(postId: number): Promise<ReplyContent[]> {
        const replyContents = Array(10).fill(null).map((_, i) => ({
            id: i,
            posterId: i,
            posterName: `UserName@World${i}`,
            originalPostId: postId,
            originalReplyId: i % 2 === 0 ? i : null,
            replyNestingLevel: i % 2 === 0 ? 1 : 0,
            releaseInformationId: 1,
            releaseVersion: "1.0.0",
            releaseName: "Mock Release",
            content: `Mock content ${i}`,
            createdAt: new Date(),
        }));
        return replyContents;
    }
}