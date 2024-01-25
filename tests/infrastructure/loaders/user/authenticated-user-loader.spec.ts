import { describe, test, expect, beforeEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import FirebaseClient from "../../../../app/libraries/authentication/firebase-client";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import AuthenticatedUserProvider from "../../../../app/libraries/user/authenticated-user-provider";
import AuthenticatedUserLoader from "../../../../app/loaders/user/authenticated-user-loader";
import { postgresClientProvider } from "../../../../app/dependency-injector/get-load-context";

/**
 * Firebaseのクライアント。
 */
let firebaseClient: FirebaseClient;

/**
 * Postgresのユーザーリポジトリ。
 */
let postgresUserRepository: PostgresUserRepository;

/**
 * Firebaseの認証済みユーザーを提供するクラス。
 */
let authenticatedUserProvider: AuthenticatedUserProvider;

/**
 * 認証済みユーザーを取得するローダー。
 */
let authenticatedUserLoader: AuthenticatedUserLoader;

/**
 * メールアドレス。
 */
const mailAddress = "test@example.com";

/**
 * パスワード。
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
    authenticatedUserProvider = new AuthenticatedUserProvider(firebaseClient, postgresUserRepository);
    authenticatedUserLoader = new AuthenticatedUserLoader(authenticatedUserProvider);

    // テスト用のユーザーが存在する場合、削除する。
    try {
        // テスト用のユーザーをログインする。
        const responseSignIn = await delayAsync(() => firebaseClient.signInWithEmailPassword(mailAddress, password));

        // テスト用のユーザーを削除する。
        const idToken = responseSignIn.idToken;
        await delayAsync(() => firebaseClient.deleteUser(idToken));
        console.info("テスト用のユーザーを削除しました。");
    } catch (error) {
        console.info("テスト用のユーザーは存在しませんでした。");
    }

    // テスト用のユーザー情報が存在する場合、削除する。
    try {
        // テスト用のユーザー情報を取得する。
        const responseFindByProfileId = await delayAsync(() => postgresUserRepository.findByProfileId(profileId));

        // テスト用のユーザー情報が存在しない場合、エラーを投げる。
        if (responseFindByProfileId == null) throw new Error("The user does not exist.");

        const id = responseFindByProfileId.id;
        await delayAsync(() => postgresUserRepository.delete(id));
        console.info("テスト用のユーザー情報を削除しました。");
    } catch (error) {
        console.info("テスト用のユーザー情報は存在しませんでした。");
    }
});

describe("getUserByToken", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("getUserByToken should return an AuthenticatedUser.", async () => {
        // テスト用のユーザーを登録する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = responseSignUp.localId;
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName));

        // 認証済みユーザーを取得する。
        const idToken = responseSignUp.idToken;
        const response = await delayAsync(() => authenticatedUserLoader.getUserByToken(idToken));

        // ユーザーが存在しない場合、エラーを投げる。
        if (response === null) throw new Error("The user does not exist.");

        // 結果を検証する。
        expect(response.id).toBeDefined();
        expect(response.profileId).toBe(profileId);
        expect(response.authenticationProviderId).toBe(authenticationProviderId);
        expect(response.userName).toBe(userName);
        expect(response.createdAt).toBeInstanceOf(Date);
    });
});

describe("getAuthenticationProviderId", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("getAuthenticationProviderId should return an authentication provider ID.", async () => {
        // テスト用のユーザーを登録する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // 認証済みユーザーを取得する。
        const idToken = responseSignUp.idToken;
        const response = await delayAsync(() => authenticatedUserLoader.getAuthenticationProviderId(idToken));

        // 結果を検証する。
        expect(response).toBe(responseSignUp.localId);
    });
});