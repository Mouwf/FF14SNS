import { describe, test, expect, beforeEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
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

beforeEach(async () => {
    firebaseClient = new FirebaseClient();
    postgresUserRepository = new PostgresUserRepository(postgresClientProvider);
    authenticatedUserProvider = new AuthenticatedUserProvider(firebaseClient, postgresUserRepository);

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
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("getUserByProfileId should return an AuthenticatedUser.", async () => {
        // テスト用のユーザーを登録する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = responseSignUp.localId;
        await delayAsync(() => postgresUserRepository.create(profileId, authenticationProviderId, userName));

        // テスト用のユーザー情報を取得する。
        const responseUser = await delayAsync(() => authenticatedUserProvider.getUserByProfileId(profileId));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseUser === null) throw new Error("The user does not exist.");

        // 結果を検証する。
        expect(responseUser.id).toBeDefined();
        expect(responseUser.profileId).toBe(profileId);
        expect(responseUser.authenticationProviderId).toBe(authenticationProviderId);
        expect(responseUser.userName).toBe(userName);
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
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

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