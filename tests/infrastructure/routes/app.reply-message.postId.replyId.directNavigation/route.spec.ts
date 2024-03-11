import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../common/delete-record-for-test";
import { AppLoadContext } from "@remix-run/node";
import { appLoadContext, postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import FirebaseClient from "../../../../app/libraries/authentication/firebase-client";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import PostgresPostContentRepository from "../../../../app/repositories/post/postgres-post-content-repository";
import PostgresReplyContentRepository from "../../../../app/repositories/post/postgres-reply-content-repository";
import PostInteractor from "../../../../app/libraries/post/post-interactor";
import { loader, action } from "../../../../app/routes/app.reply-message.$postId.$replyId.$directNavigation/route";
import { commitSession, getSession } from "../../../../app/sessions";
import systemMessages from "../../../../app/messages/system-messages";

/**
 * Firebaseのクライアント。
 */
let firebaseClient: FirebaseClient;

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
 * テスト用のメールアドレス。
 */
const mailAddress = "test@example.com";

/**
 * テスト用のパスワード。
 */
const password = "testPassword123";

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
    firebaseClient = new FirebaseClient();
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
    test("loader should return a reply.", async () => {
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
                replyId: replyId.toString(),
                directNavigation: "direct",
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
        expect(result.id).toBe(replyId);
        expect(result.posterId).toBe(profileId);
        expect(result.posterName).toBe(userName);
        expect(result.originalPostId).toBe(postId);
        expect(result.originalReplyId).toBeNull();
        expect(result.replyNestingLevel).toBe(0);
        expect(result.releaseInformationId).toBe(currentReleaseInformationId);
        expect(result.releaseVersion).toBeDefined();
        expect(result.releaseName).toBeDefined();
        expect(result.replyCount).toBe(0);
        expect(result.content).toBe(replyContent);
        expect(new Date(result.createdAt)).toBeInstanceOf(Date);
    });
});

describe("action", () => {
    test("action should return a success message.", async () => {
        // テスト用のユーザーを作成する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = responseSignUp.localId;
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

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

        // アクションを実行し、結果を取得する。
        const session = await getSession();
        session.set("idToken", responseSignUp.idToken);
        session.set("refreshToken", responseSignUp.refreshToken);
        session.set("userId", profileId);
        const requestWithCookieAndBody = new Request("https://example.com", {
            headers: {
                Cookie: await commitSession(session),
            },
            method: "POST",
            body: new URLSearchParams({
                content: "アクション経由の投稿テスト！",
            }),
        });
        const response = await action({
            request: requestWithCookieAndBody,
            params: {
                postId: postId.toString(),
                replyId: replyId.toString(),
                directNavigation: "direct",
            },
            context,
        });

        // 検証に必要な情報を取得する。
        const result = await response.json();

        // 結果が存在しない場合、エラーを投げる。
        if (!("successMessage" in result) || !result.successMessage) {
            throw new Error("Response is undefined.");
        }

        // 結果を検証する。
        expect(result.successMessage).toBe(systemMessages.success.replyMessagePosted);
    });
});