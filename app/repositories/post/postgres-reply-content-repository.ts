import systemMessages from "../../messages/system-messages";
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
        const client = await this.postgresClientProvider.get();
        try {
            await client.query("BEGIN");

            // リプライを作成する。
            const replyInsertQuery = `
                INSERT INTO replies (
                    user_id,
                    original_post_id,
                    original_reply_id,
                    content
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4
                );
            `;
            const replyInsertValues = [replierId, originalPostId, originalReplyId, content];
            const replyInsertResult = await client.query(replyInsertQuery, replyInsertValues);

            // 結果がない場合、エラーを投げる。
            if (replyInsertResult.rowCount === 0) throw new Error(systemMessages.error.replyFailed);

            // コミットする。
            await client.query("COMMIT");
        } catch (error) {
            console.error(error);
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    public async delete(replyId: number): Promise<boolean> {
        const client = await this.postgresClientProvider.get();
        try {
            await client.query("BEGIN");

            // 再帰的に指定されたリプライとその全子孫リプライを削除する。
            const query = `
                WITH RECURSIVE descendant_replies AS (
                    SELECT replies.id, replies.original_reply_id
                    FROM replies
                    WHERE replies.id = $1
                    UNION ALL
                    SELECT replies.id, replies.original_reply_id
                    FROM replies
                    INNER JOIN descendant_replies ON replies.original_reply_id = descendant_replies.id
                )
                DELETE FROM replies
                WHERE replies.id IN (SELECT id FROM descendant_replies);
            `;
            const values = [replyId];
            const result = await client.query(query, values);

            // 削除対象がない場合、falseを返す。
            if (result.rowCount === 0) {
                await client.query("ROLLBACK");
                return false;
            }

            // コミットする。
            await client.query("COMMIT");
            return true;
        } catch (error) {
            console.error(error);
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    public async getById(replyId: number): Promise<ReplyContent> {
        const client = await this.postgresClientProvider.get();
        try {
            // 指定されたリプライを取得する。
            const query = `
                SELECT
                    replies.id,
                    users.id AS user_id,
                    users.user_name AS user_name,
                    replies.original_post_id AS original_post_id,
                    replies.original_reply_id AS original_reply_id,
                    replies.content,
                    replies.created_at AS created_at,
                    post_release_information_association.release_information_id,
                    release_information.release_version,
                    release_information.release_name
                FROM replies
                JOIN users ON replies.user_id = users.id
                LEFT JOIN posts ON replies.original_post_id = posts.id
                LEFT JOIN post_release_information_association ON posts.id = post_release_information_association.post_id
                LEFT JOIN release_information ON post_release_information_association.release_information_id = release_information.id
                WHERE replies.id = $1;
            `;
            const values = [replyId];
            const result = await client.query(query, values);

            // 結果がない場合、エラーを投げる。
            if (result.rows.length === 0) {
                throw new Error(`${systemMessages.error.replyNotExists} リプライID: ${replyId}`);
            }

            // リプライを生成する。
            const row = result.rows[0];
            const reply = {
                id: row.id,
                posterId: row.user_id,
                posterName: row.user_name,
                originalPostId: row.original_post_id,
                originalReplyId: row.original_reply_id,
                content: row.content,
                createdAt: row.created_at,
                replyNestingLevel: 0,
                releaseInformationId: row.release_information_id,
                releaseVersion: row.release_version,
                releaseName: row.release_name
            };
            return reply;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            client.release();
        }
    }

    public async getAllByPostId(postId: number): Promise<ReplyContent[]> {
        const client = await this.postgresClientProvider.get();
        try {
            // 全てのリプライを取得する。
            const query = `
                WITH RECURSIVE reply_hierarchy AS (
                    SELECT
                        replies.id,
                        users.id AS user_id,
                        users.user_name,
                        replies.original_post_id,
                        replies.original_reply_id AS original_reply_id,
                        replies.content,
                        replies.created_at,
                        0 AS reply_nesting_level,
                        post_release_information_association.release_information_id,
                        release_information.release_version,
                        release_information.release_name
                    FROM replies
                    JOIN users ON replies.user_id = users.id
                    LEFT JOIN post_release_information_association ON replies.original_post_id = post_release_information_association.post_id
                    LEFT JOIN release_information ON post_release_information_association.release_information_id = release_information.id
                    WHERE
                        replies.original_post_id = $1 AND
                        replies.original_reply_id IS NULL
                    UNION ALL
                    SELECT
                        replies.id,
                        users.id AS user_id,
                        users.user_name,
                        replies.original_post_id,
                        replies.original_reply_id,
                        replies.content,
                        replies.created_at,
                        reply_hierarchy.reply_nesting_level + 1, -- 階層レベルを1つ増やす
                        post_release_information_association.release_information_id,
                        release_information.release_version,
                        release_information.release_name
                    FROM replies
                    JOIN reply_hierarchy ON replies.original_reply_id = reply_hierarchy.id
                    JOIN users ON replies.user_id = users.id
                    LEFT JOIN post_release_information_association ON replies.original_post_id = post_release_information_association.post_id
                    LEFT JOIN release_information ON post_release_information_association.release_information_id = release_information.id
                )
                SELECT * FROM reply_hierarchy
                ORDER BY
                    reply_nesting_level,
                    created_at DESC;
            `;
            const values = [postId];
            const result = await client.query(query, values);

            // 全てのリプライを生成する。
            const replies = result.rows.map(reply => ({
                id: reply.id,
                posterId: reply.user_id,
                posterName: reply.user_name,
                originalPostId: reply.original_post_id,
                originalReplyId: reply.original_reply_id,
                replyNestingLevel: reply.reply_nesting_level,
                releaseInformationId: reply.release_information_id,
                releaseVersion: reply.release_version,
                releaseName: reply.release_name,
                content: reply.content,
                createdAt: reply.created_at,
            }));
            return replies;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            client.release();
        }
    }
}