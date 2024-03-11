import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import { AppLoadContext } from "@remix-run/node";
import { appLoadContext, postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import PostgresPostContentRepository from "../../../../app/repositories/post/postgres-post-content-repository";
import PostgresReplyContentRepository from "../../../../app/repositories/post/postgres-reply-content-repository";
import PostInteractor from "../../../../app/libraries/post/post-interactor";
import { commitSession, getSession } from "../../../../app/sessions";
import { newlyPostedPostCookie } from "../../../../app/cookies.server";
import { loader } from "../../../../app/routes/app._index/route";

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

describe("loader" , () => {
    test("loader should return latest posts.", async () => {
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

        // ローダーを実行し、結果を取得する。
        const session = await getSession();
        session.set("idToken", "idToken");
        session.set("refreshToken", "refreshToken");
        session.set("userId", profileId);
        const requestWithCookie = new Request("https://example.com", {
            headers: {
                Cookie: await commitSession(session),
            },
        });
        const response = await loader({
            request: requestWithCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const posts = await response.json();

        // 配列でない場合、エラーを投げる。
        if (!Array.isArray(posts)) {
            throw new Error(posts.errorMessage);
        }

        // 結果を検証する。
        expect(posts.length).toBeGreaterThan(0);
        expect(posts[0].id).toBe(postId);
        expect(posts[0].posterId).toBe(profileId);
        expect(posts[0].releaseInformationId).toBe(currentReleaseInformationId);
        expect(posts[0].releaseVersion).toBeDefined();
        expect(posts[0].releaseName).toBeDefined();
        expect(posts[0].replyCount).toBeGreaterThanOrEqual(0);
        expect(posts[0].content).toBe(postContent);
        expect(new Date(posts[0].createdAt)).toBeInstanceOf(Date);
    });

    test("loader should return before posts if user has cookie.", async () => {
        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = "authenticationProviderId";
        await postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId);

        // 認証済みユーザーを取得する。
        const responseAuthenticatedUser = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseAuthenticatedUser === null) throw new Error("The user does not exist.");

        // 認証済みユーザーの投稿を登録する。
        const posterId = responseAuthenticatedUser.id;
        const postContent = "postContent";
        const postId = await postInteractor.post(posterId, 1, postContent);

        // ローダーを実行し、結果を取得する。
        const session = await getSession();
        session.set("idToken", "idToken");
        session.set("refreshToken", "refreshToken");
        session.set("userId", profileId);
        const cookieSession = await commitSession(session);
        const cookie = {
            postId: postId,
        };
        const cookieNewlyPostedPost = await newlyPostedPostCookie.serialize(cookie);
        const requestWithCookie = new Request("https://example.com", {
            headers: {
                Cookie: `${cookieSession}; ${cookieNewlyPostedPost}`,
            },
        });
        const response = await loader({
            request: requestWithCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const posts = await response.json();

        // 配列でない場合、エラーを投げる。
        if (!Array.isArray(posts)) {
            throw new Error(posts.errorMessage);
        }

        // 結果を検証する。
        expect(posts.length).toBeGreaterThan(0);
        expect(posts[0].id).toBe(postId);
        expect(posts[0].posterId).toBe(profileId);
        expect(posts[0].releaseInformationId).toBe(currentReleaseInformationId);
        expect(posts[0].releaseVersion).toBeDefined();
        expect(posts[0].releaseName).toBeDefined();
        expect(posts[0].replyCount).toBeGreaterThanOrEqual(0);
        expect(posts[0].content).toBe(postContent);
        expect(new Date(posts[0].createdAt)).toBeInstanceOf(Date);
    });
});