import delayAsync from "../../test-utilityies/delay-async";
import FirebaseClient from "../../../app/libraries/authentication/firebase-client";
import { postgresClientProvider } from "../../../app/dependency-injector/get-load-context";
import PostgresUserRepository from "../../../app/repositories/user/postgres-user-repository";
import PostgresPostContentRepository from "../../../app/repositories/post/postgres-post-content-repository";
import PostgresReplyContentRepository from "../../../app/repositories/post/postgres-reply-content-repository";

/**
 * テスト用のメールアドレス。
 */
const mailAddress = "test@example.com";

/**
 * テスト用のパスワード。
 */
const password = "testPassword123";

/**
 * プロフィールID。
 */
const profileId = "username_world";

export default async function deleteRecordForTest() {
    const firebaseClient = new FirebaseClient();
    const postgresUserRepository = new PostgresUserRepository(postgresClientProvider);
    const postgresPostContentRepository = new PostgresPostContentRepository(postgresClientProvider);
    const postgresReplyContentRepository = new PostgresReplyContentRepository(postgresClientProvider);

    // テスト用の投稿が存在する場合、削除する。
    try {
        // 複数のテスト用の投稿を取得する。
        const responseGetLatestLimited = await delayAsync(() => postgresPostContentRepository.getLatestLimited(profileId, 100));

        // テスト用の投稿が存在しない場合、エラーを投げる。
        if (responseGetLatestLimited.length === 0) throw new Error("The post does not exist.");

        // テスト用の投稿を削除する。
        responseGetLatestLimited.map(async (postContent) => {
            const postId = postContent.id;
            const responseGetAllByPostId = await delayAsync(() => postgresReplyContentRepository.getAllByPostId(postId));
            responseGetAllByPostId.map(async (replyContent) => {
                await delayAsync(() => postgresReplyContentRepository.delete(replyContent.id));
            });
            await delayAsync(() => postgresPostContentRepository.delete(postId));
        });

        console.info("テスト用の投稿を削除しました。");
    } catch (error) {
        console.info("テスト用の投稿は存在しませんでした。");
    }

    // テスト用のユーザー情報が存在する場合、削除する。
    try {
        // テスト用のユーザー情報を取得する。
        const responseFindByProfileId = await delayAsync(() => postgresUserRepository.findByProfileId(profileId));

        // テスト用のユーザー情報が存在しない場合、エラーを投げる。
        if (responseFindByProfileId == null) throw new Error("The user does not exist.");

        const id = responseFindByProfileId.id;
        await delayAsync(() => postgresUserRepository.delete(id));
        console.info("テスト用のユーザー情報を削除しました。");
    } catch (error) {
        console.info("テスト用のユーザー情報は存在しませんでした。");
    }

    // テスト用のユーザーが存在する場合、削除する。
    try {
        // テスト用のユーザーをログインする。
        const responseSignIn = await delayAsync(() => firebaseClient.signInWithEmailPassword(mailAddress, password));

        // テスト用のユーザーを削除する。
        const idToken = responseSignIn.idToken;
        await delayAsync(() => firebaseClient.deleteUser(idToken));
        console.info("テスト用のユーザーを削除しました。");
    } catch (error) {
        console.info("テスト用のユーザーは存在しませんでした。");
    }
}