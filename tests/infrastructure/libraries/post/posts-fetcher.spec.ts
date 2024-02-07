import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import PostgresPostContentRepository from "../../../../app/repositories/post/postgres-post-content-repository";
import PostInteractor from "../../../../app/libraries/post/post-interactor";
import PostsFetcher from "../../../../app/libraries/post/posts-fetcher";

/**
 * Postgresのユーザーリポジトリ。
 */
let postgresUserRepository: PostgresUserRepository;

/**
 * Postgresの投稿内容リポジトリ。
 */
let postgresPostContentRepository: PostgresPostContentRepository;

/**
 * 投稿に関する処理を行うクラス。
 */
let postInteractor: PostInteractor;

/**
 * 投稿を取得するクラス。
 */
let postsFetcher: PostsFetcher;

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
    postInteractor = new PostInteractor(postgresPostContentRepository);
    postsFetcher = new PostsFetcher(postgresPostContentRepository);
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("fetchLatestPosts" , () => {
    test("fetchLatestPosts should return latest posts.", async () => {
        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = "authenticationProviderId";
        await postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId);

        // 認証済みユーザーを取得する。
        const responseAuthenticatedUser = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseAuthenticatedUser === null) throw new Error("The user does not exist.");

        // テスト用の投稿を登録する。
        const posterId = responseAuthenticatedUser.id;
        const postContent = "postContent";
        const postId = await postInteractor.post(posterId, currentReleaseInformationId, postContent);

        // 投稿を取得する。
        const posts = await postsFetcher.fetchLatestPosts(profileId, currentReleaseInformationId);

        // 結果を検証する。
        expect(posts.length).toBeGreaterThanOrEqual(1);
        expect(posts[0].id).toBe(postId);
        expect(posts[0].posterId).toBe(profileId);
        expect(posts[0].releaseInformationId).toBe(1);
        expect(posts[0].content).toBe(postContent);
        expect(posts[0].createdAt).toBeInstanceOf(Date);
    });
});