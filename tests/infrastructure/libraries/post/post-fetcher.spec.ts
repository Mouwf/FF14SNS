import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import PostgresPostContentRepository from "../../../../app/repositories/post/postgres-post-content-repository";
import PostgresReplyContentRepository from "../../../../app/repositories/post/postgres-reply-content-repository";
import PostInteractor from "../../../../app/libraries/post/post-interactor";
import PostFetcher from "../../../../app/libraries/post/post-fetcher";

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
 * 投稿を取得するクラス。
 */
let postFetcher: PostFetcher;

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
    postFetcher = new PostFetcher(postgresPostContentRepository);
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("fetchPostById" , () => {
    test("fetchPostById should return specified post.", async () => {
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

        // 投稿を取得する。
        const post = await postFetcher.fetchPostById(postId);

        // 結果を検証する。
        expect(post.id).toBe(postId);
        expect(post.posterId).toBe(profileId);
        expect(post.posterName).toBe(userName);
        expect(post.releaseInformationId).toBe(1);
        expect(post.releaseVersion).toBeDefined();
        expect(post.releaseName).toBeDefined();
        expect(post.replyCount).toBeGreaterThanOrEqual(0);
        expect(post.content).toBe(postContent);
        expect(post.createdAt).toBeInstanceOf(Date);
    });
});