import PostgresClientProvider from "../common/postgres-client-provider";
import PostContent from "../../models/post/post-content";
import IPostContentRepository from "./i-post-content-repository";

/**
 * Postgresの投稿内容リポジトリ。
 */
export default class PostgresPostContentRepository implements IPostContentRepository {
    /**
     * Postgresの投稿内容リポジトリを生成する。
     * @param postgresClientProvider Postgresクライアントプロバイダー。
     */
    constructor(
        private readonly postgresClientProvider: PostgresClientProvider,
    ) {
    }

    public async create(posterId: number, releaseInformationId: number, content: string): Promise<number> {
        const client = await this.postgresClientProvider.get();
        try {
            await client.query("BEGIN");

            // 投稿を作成する。
            const postInsertQuery = `
                INSERT INTO posts (
                    user_id,
                    content
                )
                VALUES (
                    $1,
                    $2
                )
                RETURNING id;
            `;
            const postInsertValues = [posterId, content];
            const postInsertResult = await client.query(postInsertQuery, postInsertValues);

            // 結果がない場合、エラーを投げる。
            if (postInsertResult.rowCount === 0) {
                throw new Error("投稿に失敗しました。");
            }

            // 投稿IDを取得する。
            const postId = postInsertResult.rows[0].id;

            // 投稿とリリース情報の関連を作成する。
            const releaseInformationAssociationInsertQuery = `
                INSERT INTO post_release_information_association (
                    post_id,
                    release_information_id
                )
                VALUES (
                    $1,
                    $2
                );
            `;
            const releaseInformationAssociationInsertValues = [postId, releaseInformationId];
            const releaseInformationAssociationResult = await client.query(releaseInformationAssociationInsertQuery, releaseInformationAssociationInsertValues);

            // 結果がない場合、エラーを投げる。
            if (releaseInformationAssociationResult.rowCount === 0) {
                throw new Error("投稿に失敗しました。");
            }

            // コミットする。
            await client.query("COMMIT");

            // 投稿IDを返す。
            return postId;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    public async delete(postId: number): Promise<boolean> {
        const client = await this.postgresClientProvider.get();
        try {
            await client.query("BEGIN");

            // 投稿とリリース情報の関連テーブルから関連するレコードを削除する。
            let query = `
                DELETE FROM post_release_information_association WHERE post_id = $1;
            `;
            let values = [postId];
            const resultDeleteForReleaseInformationAssociation = await client.query(query, values);

            // 投稿結果がない場合、falseを返す。
            if (resultDeleteForReleaseInformationAssociation.rowCount === 0) return false;

            // 投稿テーブルからレコードを削除する。
            query = `
                DELETE FROM posts WHERE id = $1;
            `;
            values = [postId];
            const resultForPosts = await client.query(query, values);

            // 投稿結果がない場合、falseを返す。
            if (resultForPosts.rowCount === 0) return false;

            // コミットする。
            await client.query("COMMIT");
            return true;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    public async getById(postId: number): Promise<PostContent> {
        throw new Error("Method not implemented.");
    }

    public async getLatestLimited(limit: number): Promise<PostContent[]> {
        const client = await this.postgresClientProvider.get();
        try {
            // 最新の投稿を取得する。
            const query = `
                SELECT
                    posts.id as post_id,
                    users.profile_id as profile_id,
                    users.user_name as user_name,
                    release_information.id as release_id,
                    release_information.release_version as release_version,
                    release_information.release_name as release_name,
                    posts.content,
                    posts.created_at as created_at
                FROM
                    posts
                JOIN users ON posts.user_id = users.id
                LEFT JOIN post_release_information_association ON posts.id = post_release_information_association.post_id
                LEFT JOIN release_information ON post_release_information_association.release_information_id = release_information.id
                ORDER BY posts.created_at DESC
                LIMIT $1;
            `;
            const values = [limit];
            const posts = await client.query(query, values);

            // 最新の投稿を生成する。
            return posts.rows.map(post => ({
                id: post.post_id,
                posterId: post.profile_id,
                posterName: post.user_name,
                releaseId: post.release_id,
                releaseVersion: post.release_version,
                releaseName: post.release_name,
                content: post.content,
                createdAt: post.created_at,
            }));
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }

    public async getLimitedByPosterId(posterId: number, limit: number): Promise<PostContent[]> {
        throw new Error("Method not implemented.");
    }

    public async getLimitedAfterId(postId: number, limit: number): Promise<PostContent[]> {
        throw new Error("Method not implemented.");
    }
}