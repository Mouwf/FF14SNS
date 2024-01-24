import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import FirebaseClient from "../../../../app/libraries/authentication/firebase-client";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import PostgresPostContentRepository from "../../../../app/repositories/post/postgres-post-content-repository";

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

beforeEach(async () => {
    firebaseClient = new FirebaseClient();
    postgresUserRepository = new PostgresUserRepository(postgresClientProvider);
    postgresPostContentRepository = new PostgresPostContentRepository(postgresClientProvider);
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("create", () => {
    test("create should create a post and return a post id.", async () => {
        // テスト用のユーザーを登録する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = responseSignUp.localId;
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName));

        // 認証済みユーザーを取得する。
        const responseAuthenticatedUser = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseAuthenticatedUser === null) throw new Error("The user does not exist.");

        // メッセージを投稿する。
        const posterId = responseAuthenticatedUser.id;
        const postId = await postgresPostContentRepository.create(posterId, 1, "Content");

        // 結果を検証する。
        expect(postId).toBeDefined();
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
        // テスト用のユーザーを登録する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = responseSignUp.localId;
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName));

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

describe("getLatestLimited", () => {
    test("getLatestLimited should return a post.", async () => {
        // テスト用のユーザーを登録する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = responseSignUp.localId;
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName));

        // 認証済みユーザーを取得する。
        const responseAuthenticatedUser = await delayAsync(() => postgresUserRepository.findByAuthenticationProviderId(authenticationProviderId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseAuthenticatedUser === null) throw new Error("The user does not exist.");

        // メッセージを投稿する。
        const posterId = responseAuthenticatedUser.id;
        await postgresPostContentRepository.create(posterId, 1, "Content");

        // 投稿を取得する。
        const responseGetLatestLimited = await delayAsync(() => postgresPostContentRepository.getLatestLimited(100));

        // 結果を検証する。
        expect(responseGetLatestLimited.length).toBeGreaterThan(0);
        expect(responseGetLatestLimited).toBeDefined();
    });

    test("getLatestLimited should return an empty array when the post does not exist.", async () => {
        // 投稿を取得する。
        const responseGetLatestLimited = await delayAsync(() => postgresPostContentRepository.getLatestLimited(100));

        // 結果を検証する。
        expect(responseGetLatestLimited.length).toBe(0);
    });
});