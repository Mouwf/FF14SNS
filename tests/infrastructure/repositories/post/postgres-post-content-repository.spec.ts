import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import PostgresPostContentRepository from "../../../../app/repositories/post/postgres-post-content-repository";
import PostgresReplyContentRepository from "../../../../app/repositories/post/postgres-reply-content-repository";

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
 * プロフィールID。
 */
const profileId = "username_world";

/**
 * 認証プロバイダーID。
 */
const authenticationProviderId = "test_authentication_provider_id";

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
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("create", () => {
    test("create should create a post and return a post id.", async () => {
        // テスト用のユーザー情報を登録する。
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // 認証済みユーザーを取得する。
        const responseAuthenticatedUser = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseAuthenticatedUser === null) throw new Error("The user does not exist.");

        // メッセージを投稿する。
        const posterId = responseAuthenticatedUser.id;
        const postId = await postgresPostContentRepository.create(posterId, 1, "Content");

        // 結果を検証する。
        expect(Number(postId)).toBeGreaterThan(0);
    });

    test("create should throw an error when the user does not exist.", async () => {
        expect.assertions(1);
        try {
            // メッセージを投稿する。
            const posterId = 1; // 初めてのユーザーIDが1から始まるので、最初はエラーになってしまう。
            const releaseInformationId = 1;
            const content = "Content";
            await postgresPostContentRepository.create(posterId, releaseInformationId, content);
        } catch (error) {
            // エラーを検証する。
            expect(error).toBeDefined();
        }
    });
});

describe("delete", () => {
    test("delete should delete a post.", async () => {
        // テスト用のユーザー情報を登録する。
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // 認証済みユーザーを取得する。
        const responseAuthenticatedUser = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseAuthenticatedUser === null) throw new Error("The user does not exist.");

        // メッセージを投稿する。
        const posterId = responseAuthenticatedUser.id;
        const postId = await postgresPostContentRepository.create(posterId, 1, "Content");

        // 投稿を削除する。
        const result = await postgresPostContentRepository.delete(postId);

        // 結果を検証する。
        expect(result).toBe(true);
    });

    test("delete should return false when the post does not exist.", async () => {
        // 投稿を削除する。
        const result = await postgresPostContentRepository.delete(1); // 初めての投稿IDが1から始まるので、最初はエラーになってしまう。

        // 結果を検証する。
        expect(result).toBe(false);
    });
});

describe("getById", () => {
    test("getById should return a post.", async () => {
        // テスト用のユーザー情報を登録する。
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // 認証済みユーザーを取得する。
        const responseAuthenticatedUser = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseAuthenticatedUser === null) throw new Error("The user does not exist.");

        // メッセージを投稿する。
        const posterId = responseAuthenticatedUser.id;
        const postId = await postgresPostContentRepository.create(posterId, 1, "Content");

        // 投稿を取得する。
        const responseGetById = await delayAsync(() => postgresPostContentRepository.getById(postId));

        // 結果を検証する。
        expect(responseGetById).toBeDefined();
        expect(responseGetById.id).toBe(postId);
        expect(responseGetById.posterId).toBe(profileId);
        expect(responseGetById.posterName).toBe(userName);
        expect(responseGetById.releaseInformationId).toBe(1);
        expect(responseGetById.releaseVersion).toBeDefined();
        expect(responseGetById.releaseName).toBeDefined();
        expect(responseGetById.replyCount).toBe(0);
        expect(responseGetById.content).toBe("Content");
        expect(responseGetById.createdAt).toBeInstanceOf(Date);
    });
});

describe("getLatestLimited", () => {
    test("getLatestLimited should return a post.", async () => {
        // テスト用のユーザー情報を登録する。
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // 認証済みユーザーを取得する。
        const responseAuthenticatedUser = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseAuthenticatedUser === null) throw new Error("The user does not exist.");

        // メッセージを投稿する。
        const posterId = responseAuthenticatedUser.id;
        await postgresPostContentRepository.create(posterId, 1, "Content");

        // 投稿を取得する。
        const responseGetLatestLimited = await delayAsync(() => postgresPostContentRepository.getLatestLimited(profileId, 100));

        // 結果を検証する。
        expect(responseGetLatestLimited.length).toBeGreaterThan(0);
        expect(responseGetLatestLimited).toBeDefined();
    });

    test("getLatestLimited should return a post when having a reply.", async () => {
        // テスト用のユーザー情報を登録する。
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // 認証済みユーザーを取得する。
        const responseAuthenticatedUser = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseAuthenticatedUser === null) throw new Error("The user does not exist.");

        // メッセージを投稿する。
        const posterId = responseAuthenticatedUser.id;
        const postId = await postgresPostContentRepository.create(posterId, 1, "Content");

        // リプライを行う。
        await postgresReplyContentRepository.create(posterId, postId, null, "Content");

        // 投稿を取得する。
        const responseGetLatestLimited = await delayAsync(() => postgresPostContentRepository.getLatestLimited(profileId, 100));

        // 結果を検証する。
        expect(responseGetLatestLimited).toBeDefined();
        expect(responseGetLatestLimited.length).toBeGreaterThan(0);
        expect(responseGetLatestLimited[0].id).toBe(postId);
        expect(responseGetLatestLimited[0].posterId).toBe(profileId);
        expect(responseGetLatestLimited[0].posterName).toBe(userName);
        expect(responseGetLatestLimited[0].releaseInformationId).toBe(1);
        expect(responseGetLatestLimited[0].releaseVersion).toBeDefined();
        expect(responseGetLatestLimited[0].releaseName).toBeDefined();
        expect(responseGetLatestLimited[0].replyCount).toBe(1);
        expect(responseGetLatestLimited[0].content).toBe("Content");
        expect(responseGetLatestLimited[0].createdAt).toBeInstanceOf(Date);
    });

    test("getLatestLimited should return an empty array when the post does not exist.", async () => {
        // 投稿を取得する。
        const responseGetLatestLimited = await delayAsync(() => postgresPostContentRepository.getLatestLimited(profileId, 100));

        // 結果を検証する。
        expect(responseGetLatestLimited.length).toBe(0);
    });
});