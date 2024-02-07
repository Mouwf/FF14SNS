import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
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

/**
 * 現在のリリース情報ID。
 */
const currentReleaseInformationId = 1;

beforeEach(async () => {
    firebaseClient = new FirebaseClient();
    postgresUserRepository = new PostgresUserRepository(postgresClientProvider);
    authenticatedUserProvider = new AuthenticatedUserProvider(firebaseClient, postgresUserRepository);
    authenticatedUserLoader = new AuthenticatedUserLoader(authenticatedUserProvider);
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("getUserByToken", () => {
    test("getUserByToken should return an AuthenticatedUser.", async () => {
        // テスト用のユーザーを登録する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = responseSignUp.localId;
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

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

describe("getUserByProfileId", () => {
    test("getUserByProfileId should return an AuthenticatedUser.", async () => {
        // テスト用のユーザーを登録する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = responseSignUp.localId;
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // 認証済みユーザーを取得する。
        const response = await delayAsync(() => authenticatedUserLoader.getUserByProfileId(profileId));

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