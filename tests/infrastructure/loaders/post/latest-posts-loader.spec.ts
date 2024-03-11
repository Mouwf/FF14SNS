import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import PostgresPostContentRepository from "../../../../app/repositories/post/postgres-post-content-repository";
import PostgresReplyContentRepository from "../../../../app/repositories/post/postgres-reply-content-repository";
import PostInteractor from "../../../../app/libraries/post/post-interactor";
import PostsFetcher from "../../../../app/libraries/post/posts-fetcher";
import LatestPostsLoader from "../../../../app/loaders/post/latest-posts-loader";

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
let postsFetcher: PostsFetcher;

/**
 * 最新の投稿を取得するローダー。
 */
let latestPostsLoader: LatestPostsLoader;

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
    postsFetcher = new PostsFetcher(postgresPostContentRepository);
    latestPostsLoader = new LatestPostsLoader(postsFetcher);
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("getLatestPosts" , () => {
    test("getLatestPosts should return latest posts.", async () => {
        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = "authenticationProviderId";
        await postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId);

        // 認証済みユーザーを取得する。
        const responseAuthenticatedUser = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseAuthenticatedUser === null) throw new Error("The user does not exist.");

        // 投稿を作成する。
        const posterId = responseAuthenticatedUser.id;
        const postContent = "postContent";
        const postId = await postInteractor.post(posterId, 1, postContent);

        // 最新の投稿を取得する。
        const posts = await latestPostsLoader.getLatestPosts(profileId);

        // 結果を検証する。
        expect(posts.length).toBeGreaterThanOrEqual(1);
        expect(posts[0].id).toBe(postId);
        expect(posts[0].posterId).toBe(profileId);
        expect(posts[0].releaseInformationId).toBe(1);
        expect(posts[0].releaseVersion).toBeDefined();
        expect(posts[0].releaseName).toBeDefined();
        expect(posts[0].replyCount).toBeGreaterThanOrEqual(0);
        expect(posts[0].content).toBe(postContent);
        expect(posts[0].createdAt).toBeInstanceOf(Date);
    });
});