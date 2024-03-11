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

    public async create(replierId: number, originalPostId: number, originalReplyId: number | null, content: string): Promise<number> {
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
                )
                RETURNING id;
            `;
            const replyInsertValues = [replierId, originalPostId, originalReplyId, content];
            const replyInsertResult = await client.query(replyInsertQuery, replyInsertValues);

            // 結果がない場合、エラーを投げる。
            if (replyInsertResult.rowCount === 0) throw new Error(systemMessages.error.replyFailed);

            // リプライIDを取得する。
            const replyId = replyInsertResult.rows[0].id;

            // コミットする。
            await client.query("COMMIT");

            // リプライIDを返す。
            return replyId;
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
                    users.profile_id,
                    users.user_name,
                    replies.original_post_id,
                    replies.original_reply_id,
                    post_release_information_association.release_information_id,
                    release_information.release_version,
                    release_information.release_name,
                    (SELECT COUNT(*) FROM replies sub_replies WHERE sub_replies.original_reply_id = replies.id) AS reply_count,
                    replies.content,
                    replies.created_at AS created_at
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
                posterId: row.profile_id,
                posterName: row.user_name,
                originalPostId: row.original_post_id,
                originalReplyId: row.original_reply_id,
                replyNestingLevel: 0,
                releaseInformationId: row.release_information_id,
                releaseVersion: row.release_version,
                releaseName: row.release_name,
                replyCount: parseInt(row.reply_count),
                content: row.content,
                createdAt: row.created_at,
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
        const unsortedReplies = await this.getAllUnsortedByPostId(postId);
        const groupedReplies = this.groupReplies(unsortedReplies);
        const sortedReplies = this.sortReplies(groupedReplies, null);
        return sortedReplies;
    }

    /**
     * 指定された投稿に関連するソートされていない全てのリプライを取得する。
     * @param postId 投稿ID。
     * @returns 
     */
    private async getAllUnsortedByPostId(postId: number): Promise<ReplyContent[]> {
        const client = await this.postgresClientProvider.get();
        try {
            // ソートされていない全てのリプライを取得する。
            const query = `
                WITH RECURSIVE reply_hierarchy AS (
                    SELECT
                        replies.id,
                        users.profile_id,
                        users.user_name,
                        replies.original_post_id,
                        replies.original_reply_id,
                        0 AS reply_nesting_level,
                        post_release_information_association.release_information_id,
                        release_information.release_version,
                        release_information.release_name,
                        (SELECT COUNT(*) FROM replies as sub_replies WHERE sub_replies.original_reply_id = replies.id) AS reply_count,
                        replies.content,
                        replies.created_at
                    FROM replies
                    JOIN users ON replies.user_id = users.id
                    LEFT JOIN post_release_information_association ON replies.original_post_id = post_release_information_association.post_id
                    LEFT JOIN release_information ON post_release_information_association.release_information_id = release_information.id
                    WHERE
                        replies.original_post_id = $1
                        AND replies.original_reply_id IS NULL
                    UNION ALL
                    SELECT
                        replies.id,
                        users.profile_id,
                        users.user_name,
                        replies.original_post_id,
                        replies.original_reply_id,
                        reply_hierarchy.reply_nesting_level + 1,
                        post_release_information_association.release_information_id,
                        release_information.release_version,
                        release_information.release_name,
                        (SELECT COUNT(*) FROM replies as sub_replies WHERE sub_replies.original_reply_id = replies.id) AS reply_count,
                        replies.content,
                        replies.created_at
                    FROM replies
                    JOIN reply_hierarchy ON replies.original_reply_id = reply_hierarchy.id
                    JOIN users ON replies.user_id = users.id
                    LEFT JOIN post_release_information_association ON replies.original_post_id = post_release_information_association.post_id
                    LEFT JOIN release_information ON post_release_information_association.release_information_id = release_information.id
                )
                SELECT * FROM reply_hierarchy
            `;
            const values = [postId];
            const result = await client.query(query, values);

            // ソートされていない全てのリプライを生成する。
            const unsortedReplies = result.rows.map(reply => ({
                id: reply.id,
                posterId: reply.profile_id,
                posterName: reply.user_name,
                originalPostId: reply.original_post_id,
                originalReplyId: reply.original_reply_id,
                replyNestingLevel: reply.reply_nesting_level,
                releaseInformationId: reply.release_information_id,
                releaseVersion: reply.release_version,
                releaseName: reply.release_name,
                replyCount: parseInt(reply.reply_count),
                content: reply.content,
                createdAt: reply.created_at,
            }));
            return unsortedReplies;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * リプライ先リプライIDでリプライをグループ化する。
     * @param replies グループ化するリプライ。
     * @returns グループ化されたリプライ。
     */
    private groupReplies(replies: ReplyContent[]): Map<number | null, ReplyContent[]> {
        const groupedReplies = new Map<number | null, ReplyContent[]>();
        replies.forEach(reply => {
            const key = reply.originalReplyId === null ? null : reply.originalReplyId;
            if (!groupedReplies.has(key)) {
                groupedReplies.set(key, []);
            }
            groupedReplies.get(key)!.push(reply);
        });
        return groupedReplies;
    }

    /**
     * 指定された投稿に関連する全てのリプライをソートする。
     * 以下のように階層的にソートを行う。リプライの番号が新しいほど作成日時が新しい。
     * リプライ4
     *  |_ リプライ8
     *  |_ リプライ6
     *  |   |_ リプライ9
     * リプライ2
     *  |_ リプライ3
     *  |   |_ リプライ5
     *  |   |   |_ リプライ10
     *  |   |   |_ リプライ7
     * リプライ1
     * @param postId 投稿ID。
     * @returns ソートされた全てのリプライ。
     */
    private sortReplies(groupedReplies: Map<number | null, ReplyContent[]>, parentId: number | null): ReplyContent[] {
        // 現在の階層のリプライを降順に並び替える。
        if (!groupedReplies.has(parentId)) return [];
        const currentLevelReplies = groupedReplies.get(parentId)!.sort((reply1, reply2) => reply2.createdAt.getTime() - reply1.createdAt.getTime());

        // 現在の階層の各リプライに対して子リプライも再帰的に並び替え、連結する。
        let sortedReplies: ReplyContent[] = [];
        currentLevelReplies.forEach(reply => {
            const childReplies = this.sortReplies(groupedReplies, reply.id);
            sortedReplies = sortedReplies.concat([reply], childReplies);
        });
        return sortedReplies;
      }
}