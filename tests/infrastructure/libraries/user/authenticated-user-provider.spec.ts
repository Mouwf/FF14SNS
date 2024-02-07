import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import AuthenticatedUserProvider from "../../../../app/libraries/user/authenticated-user-provider";
import FirebaseClient from "../../../../app/libraries/authentication/firebase-client";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
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
 * 認証済みユーザーを提供するクラス。
 */
let authenticatedUserProvider: AuthenticatedUserProvider;

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

beforeEach(async () => {
    firebaseClient = new FirebaseClient();
    postgresUserRepository = new PostgresUserRepository(postgresClientProvider);
    authenticatedUserProvider = new AuthenticatedUserProvider(firebaseClient, postgresUserRepository);
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

        // テスト用のユーザー情報を取得する。
        const idToken = responseSignUp.idToken;
        const responseUser = await delayAsync(() => authenticatedUserProvider.getUserByToken(idToken));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseUser === null) throw new Error("The user does not exist.");

        // 結果を検証する。
        expect(responseUser.id).toBeDefined();
        expect(responseUser.profileId).toBe(profileId);
        expect(responseUser.authenticationProviderId).toBe(authenticationProviderId);
        expect(responseUser.userName).toBe(userName);
        expect(responseUser.currentReleaseVersion).toBeDefined();
        expect(responseUser.currentReleaseName).toBeDefined();
        expect(new Date(responseUser.createdAt)).toBeInstanceOf(Date);
    });

    test("getUserByToken should return null if the user does not exist.", async () => {
        // テスト用のユーザーを登録する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // ユーザー情報を取得する。
        const idToken = responseSignUp.idToken;
        const responseUser = await delayAsync(() => authenticatedUserProvider.getUserByToken(idToken));
    
        // 結果を検証する。
        expect(responseUser).toBeNull();
    });
});

describe("getUserByProfileId", () => {
    test("getUserByProfileId should return an AuthenticatedUser.", async () => {
        // テスト用のユーザーを登録する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = responseSignUp.localId;
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName, currentReleaseInformationId));

        // テスト用のユーザー情報を取得する。
        const responseUser = await delayAsync(() => authenticatedUserProvider.getUserByProfileId(profileId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseUser === null) throw new Error("The user does not exist.");

        // 結果を検証する。
        expect(responseUser.id).toBeDefined();
        expect(responseUser.profileId).toBe(profileId);
        expect(responseUser.authenticationProviderId).toBe(authenticationProviderId);
        expect(responseUser.userName).toBe(userName);
        expect(responseUser.currentReleaseVersion).toBeDefined();
        expect(responseUser.currentReleaseName).toBeDefined();
        expect(new Date(responseUser.createdAt)).toBeInstanceOf(Date);
    });

    test("getUserByProfileId should return null if the user does not exist.", async () => {
        // テスト用のユーザー情報を取得する。
        const responseUser = await delayAsync(() => authenticatedUserProvider.getUserByProfileId(profileId));
    
        // 結果を検証する。
        expect(responseUser).toBeNull();
    });
});

describe("getAuthenticationProviderId", () => {
    test("getAuthenticationProviderId should return an authentication provider ID.", async () => {
        // テスト用のユーザーを登録する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // ユーザー情報を取得する。
        const idToken = responseSignUp.idToken;
        const responseAuthenticationProviderId = await delayAsync(() => authenticatedUserProvider.getAuthenticationProviderId(idToken));
    
        // 結果を検証する。
        expect(responseAuthenticationProviderId).toBe(responseSignUp.localId);
    });
});