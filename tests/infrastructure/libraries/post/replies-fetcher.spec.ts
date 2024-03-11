import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import PostgresPostContentRepository from "../../../../app/repositories/post/postgres-post-content-repository";
import PostgresReplyContentRepository from "../../../../app/repositories/post/postgres-reply-content-repository";
import PostInteractor from "../../../../app/libraries/post/post-interactor";
import RepliesFetcher from "../../../../app/libraries/post/replies-fetcher";

/**
 * Postgresのユーザーリポジトリ。
 */
let postgresUserRepository: PostgresUserRepository;

/**
 * Postgresの投稿内容リポジトリ。
 */
let postgresPostContentRepository: PostgresPostContentRepository;

/**
 * Postgresのリプライ内容リポジトリ。
 */
let postgresReplyContentRepository: PostgresReplyContentRepository;

/**
 * 投稿に関する処理を行うクラス。
 */
let postInteractor: PostInteractor;

/**
 * 複数のリプライを取得するクラス。
 */
let repliesFetcher: RepliesFetcher;

/**
 * プロフィールID。
 */
const profileId = "username_world";

/**
 * ユーザー名。
 */
const userName = "UserName@World";

/**
 * 現在のリリース情報ID。
 */
const currentReleaseInformationId = 1;

beforeEach(async () => {
    postgresUserRepository = new PostgresUserRepository(postgresClientProvider);
    postgresPostContentRepository = new PostgresPostContentRepository(postgresClientProvider);
    postgresReplyContentRepository = new PostgresReplyContentRepository(postgresClientProvider);
    postInteractor = new PostInteractor(postgresPostContentRepository, postgresReplyContentRepository);
    repliesFetcher = new RepliesFetcher(postgresReplyContentRepository);
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("fetchAllByPostId" , () => {
    test("fetchAllByPostId should return all replies by post id.", async () => {
        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = "authenticationProviderId";
        await postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId);

        // 認証済みユーザーを取得する。
        const responseAuthenticatedUser = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseAuthenticatedUser === null) throw new Error("The user does not exist.");

        // メッセージを投稿する。
        const posterId = responseAuthenticatedUser.id;
        const postContent = "postContent";
        const postId = await postInteractor.post(posterId, currentReleaseInformationId, postContent);

        // リプライを行う。
        const replyContent1 = "ReplyContent1";
        const replyContent2 = "ReplyContent2";
        const replyId1 = await postInteractor.reply(posterId, postId, null, replyContent1);
        const replyId2 = await postInteractor.reply(posterId, postId, replyId1, replyContent2);

        // リプライを取得する。
        const replies = await repliesFetcher.fetchAllByPostId(postId);

        // 結果を検証する。
        expect(replies).toHaveLength(2);
        expect(replies[0].id).toBe(replyId1);
        expect(replies[0].posterId).toBe(profileId);
        expect(replies[0].originalPostId).toBe(postId);
        expect(replies[0].originalReplyId).toBeNull();
        expect(replies[0].replyNestingLevel).toBe(0);
        expect(replies[0].releaseInformationId).toBe(currentReleaseInformationId);
        expect(replies[0].releaseVersion).toBeDefined();
        expect(replies[0].releaseName).toBeDefined();
        expect(replies[0].replyCount).toBe(1);
        expect(replies[0].content).toBe(replyContent1);
        expect(replies[0].createdAt).toBeInstanceOf(Date);
        expect(replies[1].id).toBe(replyId2);
        expect(replies[1].posterId).toBe(profileId);
        expect(replies[1].originalPostId).toBe(postId);
        expect(replies[1].originalReplyId).toBe(replyId1);
        expect(replies[1].replyNestingLevel).toBe(1);
        expect(replies[1].releaseInformationId).toBe(currentReleaseInformationId);
        expect(replies[1].releaseVersion).toBeDefined();
        expect(replies[1].releaseName).toBeDefined();
        expect(replies[1].replyCount).toBeGreaterThanOrEqual(0);
        expect(replies[1].content).toBe(replyContent2);
        expect(replies[1].createdAt).toBeInstanceOf(Date);
    });
});