import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import PostgresPostContentRepository from "../../../../app/repositories/post/postgres-post-content-repository";
import PostgresReplyContentRepository from "../../../../app/repositories/post/postgres-reply-content-repository";
import PostInteractor from "../../../../app/libraries/post/post-interactor";
import ReplyFetcher from "../../../../app/libraries/post/reply-fetcher";

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
 * リプライを取得するクラス。
 */
let replyFetcher: ReplyFetcher;

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
    replyFetcher = new ReplyFetcher(postgresReplyContentRepository);
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("fetchReplyById" , () => {
    test("fetchReplyById should return specified reply.", async () => {
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
        const reply = await replyFetcher.fetchReplyById(replyId);

        // 結果を検証する。
        expect(reply.id).toBe(replyId);
        expect(reply.posterId).toBe(profileId);
        expect(reply.posterName).toBe(userName);
        expect(reply.originalPostId).toBe(postId);
        expect(reply.originalReplyId).toBeNull();
        expect(reply.replyNestingLevel).toBe(0);
        expect(reply.releaseInformationId).toBe(1);
        expect(reply.releaseVersion).toBeDefined();
        expect(reply.releaseName).toBeDefined();
        expect(reply.replyCount).toBeGreaterThanOrEqual(0);
        expect(reply.content).toBe(replyContent);
        expect(reply.createdAt).toBeInstanceOf(Date);
    });
});