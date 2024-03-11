import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../common/delete-record-for-test";
import { AppLoadContext } from "@remix-run/node";
import { appLoadContext, postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import PostgresPostContentRepository from "../../../../app/repositories/post/postgres-post-content-repository";
import PostgresReplyContentRepository from "../../../../app/repositories/post/postgres-reply-content-repository";
import PostInteractor from "../../../../app/libraries/post/post-interactor";
import { loader } from "../../../../app/routes/app.post-detail.$postId/route";

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

/**
 * コンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    postgresUserRepository = new PostgresUserRepository(postgresClientProvider);
    postgresPostContentRepository = new PostgresPostContentRepository(postgresClientProvider);
    postgresReplyContentRepository = new PostgresReplyContentRepository(postgresClientProvider);
    postInteractor = new PostInteractor(postgresPostContentRepository, postgresReplyContentRepository);
    context = appLoadContext;
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("loader", () => {
    test("loader should return a post and its replies.", async () => {
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
        const replyContent = "replyContent";
        const replyId = await postInteractor.reply(posterId, postId, null, replyContent);

        // ローダーを実行し、結果を取得する。
        const request = new Request("https://example.com");
        const response = await loader({
            request: request,
            params: {
                postId: postId.toString(),
            },
            context,
        });

        // 検証に必要な情報を取得する。
        const result = await response.json();

        // エラーが発生していた場合、エラーを投げる。
        if ("errorMessage" in result) {
            throw new Error(result.errorMessage);
        }

        // 結果を検証する。
        expect(result.post.id).toBe(postId);
        expect(result.post.posterId).toBe(profileId);
        expect(result.post.posterName).toBe(userName);
        expect(result.post.releaseInformationId).toBe(currentReleaseInformationId);
        expect(result.post.releaseVersion).toBeDefined();
        expect(result.post.releaseName).toBeDefined();
        expect(result.post.replyCount).toBe(1);
        expect(result.post.content).toBe(postContent);
        expect(new Date(result.post.createdAt)).toBeInstanceOf(Date);
        expect(result.replies.length).toBe(1);
        expect(result.replies[0].id).toBe(replyId);
        expect(result.replies[0].posterId).toBe(profileId);
        expect(result.replies[0].posterName).toBe(userName);
        expect(result.replies[0].originalPostId).toBe(postId);
        expect(result.replies[0].originalReplyId).toBeNull();
        expect(result.replies[0].replyNestingLevel).toBe(0);
        expect(result.replies[0].releaseInformationId).toBe(currentReleaseInformationId);
        expect(result.replies[0].releaseVersion).toBeDefined();
        expect(result.replies[0].releaseName).toBeDefined();
        expect(result.replies[0].replyCount).toBe(0);
        expect(result.replies[0].content).toBe(replyContent);
        expect(new Date(result.replies[0].createdAt)).toBeInstanceOf(Date);
    });
});