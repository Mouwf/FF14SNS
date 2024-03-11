import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import PostgresPostContentRepository from "../../../../app/repositories/post/postgres-post-content-repository";
import PostgresReplyContentRepository from "../../../../app/repositories/post/postgres-reply-content-repository";
import PostInteractor from "../../../../app/libraries/post/post-interactor";
import RepliesFetcher from "../../../../app/libraries/post/replies-fetcher";
import RepliesLoader from "../../../../app/loaders/post/replies-loader";

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
 * リプライを取得するローダー。
 */
let repliesLoader: RepliesLoader;

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
    repliesLoader = new RepliesLoader(repliesFetcher);
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("getAllRepliesByPostId" , () => {
    test("getAllRepliesByPostId should return all replies by post id.", async () => {
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
        const replyContent = "ReplyContent";
        const replyId = await postInteractor.reply(posterId, postId, null, replyContent);

        // リプライを取得する。
        const replies = await repliesFetcher.fetchAllByPostId(postId);

        // 結果を検証する。
        expect(replies).toHaveLength(1);
        expect(replies[0].id).toBe(replyId);
        expect(replies[0].posterId).toBe(profileId);
        expect(replies[0].originalPostId).toBe(postId);
        expect(replies[0].originalReplyId).toBeNull();
        expect(replies[0].replyNestingLevel).toBe(0);
        expect(replies[0].releaseInformationId).toBe(currentReleaseInformationId);
        expect(replies[0].releaseVersion).toBeDefined();
        expect(replies[0].releaseName).toBeDefined();
        expect(replies[0].replyCount).toBe(0);
        expect(replies[0].content).toBe(replyContent);
        expect(replies[0].createdAt).toBeInstanceOf(Date);
    });
});