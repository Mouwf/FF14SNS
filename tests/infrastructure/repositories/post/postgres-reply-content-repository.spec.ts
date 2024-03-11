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
        const postId = await postgresPostContentRepository.create(posterId, currentReleaseInformationId, "Content");

        // リプライを行う。
        const replyId = await postgresReplyContentRepository.create(posterId, postId, null, "Content");

        // 結果を検証する。
        expect(Number(replyId)).toBeGreaterThan(0);
    });
});

describe("delete", () => {
    test("delete should delete a post and return true.", async () => {
        // テスト用のユーザー情報を登録する。
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // 認証済みユーザーを取得する。
        const responseAuthenticatedUser = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseAuthenticatedUser === null) throw new Error("The user does not exist.");

        // メッセージを投稿する。
        const posterId = responseAuthenticatedUser.id;
        const postId = await postgresPostContentRepository.create(posterId, currentReleaseInformationId, "Content");

        // リプライを行う。
        const replyContent1 = "ReplyContent1";
        const replyContent2 = "ReplyContent2";
        const replyId1 = await postgresReplyContentRepository.create(posterId, postId, null, replyContent1);
        await postgresReplyContentRepository.create(posterId, postId, replyId1, replyContent2);

        // リプライを削除する。
        const result = await postgresReplyContentRepository.delete(replyId1);

        // 結果を検証する。
        expect(result).toBeTruthy();
    });
});

describe("getById", () => {
    test("getById should return a reply.", async () => {
        // テスト用のユーザー情報を登録する。
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // 認証済みユーザーを取得する。
        const responseAuthenticatedUser = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseAuthenticatedUser === null) throw new Error("The user does not exist.");

        // メッセージを投稿する。
        const posterId = responseAuthenticatedUser.id;
        const postId = await postgresPostContentRepository.create(posterId, currentReleaseInformationId, "Content");

        // リプライを行う。
        const replyContent = "ReplyContent";
        const replyId = await postgresReplyContentRepository.create(posterId, postId, null, replyContent);

        // リプライを取得する。
        const reply = await postgresReplyContentRepository.getById(replyId);

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

describe("getAllByPostId", () => {
    test("getAllByPostId should return all replies by post id.", async () => {
        // テスト用のユーザー情報を登録する。
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // 認証済みユーザーを取得する。
        const responseAuthenticatedUser = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseAuthenticatedUser === null) throw new Error("The user does not exist.");

        // メッセージを投稿する。
        const posterId = responseAuthenticatedUser.id;
        const postId = await postgresPostContentRepository.create(posterId, currentReleaseInformationId, "Content");

        // リプライを行う。
        const replyContent1 = "ReplyContent1";
        const replyId1 = await postgresReplyContentRepository.create(posterId, postId, null, replyContent1);
        const replyContent2 = "ReplyContent2";
        const replyId2 = await postgresReplyContentRepository.create(posterId, postId, null, replyContent2);
        const replyContent3 = "ReplyContent3";
        const replyId3 = await postgresReplyContentRepository.create(posterId, postId, replyId2, replyContent3);
        const replyContent4 = "ReplyContent4";
        const replyId4 = await postgresReplyContentRepository.create(posterId, postId, null, replyContent4);
        const replyContent5 = "ReplyContent5";
        const replyId5 = await postgresReplyContentRepository.create(posterId, postId, replyId3, replyContent5);
        const replyContent6 = "ReplyContent6";
        const replyId6 = await postgresReplyContentRepository.create(posterId, postId, replyId4, replyContent6);
        const replyContent7 = "ReplyContent7";
        const replyId7 = await postgresReplyContentRepository.create(posterId, postId, replyId5, replyContent7);
        const replyContent8 = "ReplyContent8";
        const replyId8 = await postgresReplyContentRepository.create(posterId, postId, replyId4, replyContent8);
        const replyContent9 = "ReplyContent9";
        const replyId9 = await postgresReplyContentRepository.create(posterId, postId, replyId6, replyContent9);
        const replyContent10 = "ReplyContent10";
        const replyId10 = await postgresReplyContentRepository.create(posterId, postId, replyId5, replyContent10);

        // リプライを取得する。
        const replies = await postgresReplyContentRepository.getAllByPostId(postId);

        // 結果を検証する。
        expect(replies).toHaveLength(10);

        // リプライ4。
        expect(replies[0].id).toBe(replyId4);
        expect(replies[0].posterId).toBe(profileId);
        expect(replies[0].originalPostId).toBe(postId);
        expect(replies[0].originalReplyId).toBeNull();
        expect(replies[0].replyNestingLevel).toBe(0);
        expect(replies[0].releaseInformationId).toBe(currentReleaseInformationId);
        expect(replies[0].releaseVersion).toBeDefined();
        expect(replies[0].releaseName).toBeDefined();
        expect(replies[0].replyCount).toBe(2);
        expect(replies[0].content).toBe(replyContent4);
        expect(replies[0].createdAt).toBeInstanceOf(Date);

        // リプライ8。
        expect(replies[1].id).toBe(replyId8);
        expect(replies[1].posterId).toBe(profileId);
        expect(replies[1].originalPostId).toBe(postId);
        expect(replies[1].originalReplyId).toBe(replyId4);
        expect(replies[1].replyNestingLevel).toBe(1);
        expect(replies[1].releaseInformationId).toBe(currentReleaseInformationId);
        expect(replies[1].releaseVersion).toBeDefined();
        expect(replies[1].releaseName).toBeDefined();
        expect(replies[1].replyCount).toBe(0);
        expect(replies[1].content).toBe(replyContent8);
        expect(replies[1].createdAt).toBeInstanceOf(Date);

        // リプライ6。
        expect(replies[2].id).toBe(replyId6);
        expect(replies[2].posterId).toBe(profileId);
        expect(replies[2].originalPostId).toBe(postId);
        expect(replies[2].originalReplyId).toBe(replyId4);
        expect(replies[2].replyNestingLevel).toBe(1);
        expect(replies[2].releaseInformationId).toBe(currentReleaseInformationId);
        expect(replies[2].releaseVersion).toBeDefined();
        expect(replies[2].releaseName).toBeDefined();
        expect(replies[2].replyCount).toBe(1);
        expect(replies[2].content).toBe(replyContent6);
        expect(replies[2].createdAt).toBeInstanceOf(Date);

        // リプライ9。
        expect(replies[3].id).toBe(replyId9);
        expect(replies[3].posterId).toBe(profileId);
        expect(replies[3].originalPostId).toBe(postId);
        expect(replies[3].originalReplyId).toBe(replyId6);
        expect(replies[3].replyNestingLevel).toBe(2);
        expect(replies[3].releaseInformationId).toBe(currentReleaseInformationId);
        expect(replies[3].releaseVersion).toBeDefined();
        expect(replies[3].releaseName).toBeDefined();
        expect(replies[3].replyCount).toBe(0);
        expect(replies[3].content).toBe(replyContent9);
        expect(replies[3].createdAt).toBeInstanceOf(Date);

        // リプライ2。
        expect(replies[4].id).toBe(replyId2);
        expect(replies[4].posterId).toBe(profileId);
        expect(replies[4].originalPostId).toBe(postId);
        expect(replies[4].originalReplyId).toBeNull();
        expect(replies[4].replyNestingLevel).toBe(0);
        expect(replies[4].releaseInformationId).toBe(currentReleaseInformationId);
        expect(replies[4].releaseVersion).toBeDefined();
        expect(replies[4].releaseName).toBeDefined();
        expect(replies[4].replyCount).toBe(1);
        expect(replies[4].content).toBe(replyContent2);
        expect(replies[4].createdAt).toBeInstanceOf(Date);

        // リプライ3。
        expect(replies[5].id).toBe(replyId3);
        expect(replies[5].posterId).toBe(profileId);
        expect(replies[5].originalPostId).toBe(postId);
        expect(replies[5].originalReplyId).toBe(replyId2);
        expect(replies[5].replyNestingLevel).toBe(1);
        expect(replies[5].releaseInformationId).toBe(currentReleaseInformationId);
        expect(replies[5].releaseVersion).toBeDefined();
        expect(replies[5].releaseName).toBeDefined();
        expect(replies[5].replyCount).toBe(1);
        expect(replies[5].content).toBe(replyContent3);
        expect(replies[5].createdAt).toBeInstanceOf(Date);

        // リプライ5。
        expect(replies[6].id).toBe(replyId5);
        expect(replies[6].posterId).toBe(profileId);
        expect(replies[6].originalPostId).toBe(postId);
        expect(replies[6].originalReplyId).toBe(replyId3);
        expect(replies[6].replyNestingLevel).toBe(2);
        expect(replies[6].releaseInformationId).toBe(currentReleaseInformationId);
        expect(replies[6].releaseVersion).toBeDefined();
        expect(replies[6].releaseName).toBeDefined();
        expect(replies[6].replyCount).toBe(2);
        expect(replies[6].content).toBe(replyContent5);
        expect(replies[6].createdAt).toBeInstanceOf(Date);

        // リプライ10。
        expect(replies[7].id).toBe(replyId10);
        expect(replies[7].posterId).toBe(profileId);
        expect(replies[7].originalPostId).toBe(postId);
        expect(replies[7].originalReplyId).toBe(replyId5);
        expect(replies[7].replyNestingLevel).toBe(3);
        expect(replies[7].releaseInformationId).toBe(currentReleaseInformationId);
        expect(replies[7].releaseVersion).toBeDefined();
        expect(replies[7].releaseName).toBeDefined();
        expect(replies[7].replyCount).toBe(0);
        expect(replies[7].content).toBe(replyContent10);
        expect(replies[7].createdAt).toBeInstanceOf(Date);

        // リプライ7。
        expect(replies[8].id).toBe(replyId7);
        expect(replies[8].posterId).toBe(profileId);
        expect(replies[8].originalPostId).toBe(postId);
        expect(replies[8].originalReplyId).toBe(replyId5);
        expect(replies[8].replyNestingLevel).toBe(3);
        expect(replies[8].releaseInformationId).toBe(currentReleaseInformationId);
        expect(replies[8].releaseVersion).toBeDefined();
        expect(replies[8].releaseName).toBeDefined();
        expect(replies[8].replyCount).toBe(0);
        expect(replies[8].content).toBe(replyContent7);
        expect(replies[8].createdAt).toBeInstanceOf(Date);

        // リプライ1。
        expect(replies[9].id).toBe(replyId1);
        expect(replies[9].posterId).toBe(profileId);
        expect(replies[9].originalPostId).toBe(postId);
        expect(replies[9].originalReplyId).toBeNull();
        expect(replies[9].replyNestingLevel).toBe(0);
        expect(replies[9].releaseInformationId).toBe(currentReleaseInformationId);
        expect(replies[9].releaseVersion).toBeDefined();
        expect(replies[9].releaseName).toBeDefined();
        expect(replies[9].replyCount).toBe(0);
        expect(replies[9].content).toBe(replyContent1);
        expect(replies[9].createdAt).toBeInstanceOf(Date);
    });
});