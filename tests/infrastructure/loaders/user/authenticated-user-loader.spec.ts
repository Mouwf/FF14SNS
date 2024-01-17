import { describe, test, expect, beforeEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import FirebaseClient from "../../../../app/libraries/authentication/firebase-client";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";
import AuthenticatedUserProvider from "../../../../app/libraries/user/authenticated-user-provider";
import AuthenticatedUserLoader from "../../../../app/loaders/user/authenticated-user-loader";

/**
 * Firebaseのクライアント。
 */
let firebaseClient: FirebaseClient;

/**
 * Postgresのユーザーリポジトリ。
 */
let posgresUserRepository: PostgresUserRepository;

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
const profileId = "test_unicorn";

beforeEach(async () => {
    firebaseClient = new FirebaseClient();
    posgresUserRepository = new PostgresUserRepository();
    authenticatedUserProvider = new AuthenticatedUserProvider(firebaseClient, posgresUserRepository);
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
        const responseFindByProfileId = await delayAsync(() => posgresUserRepository.findByProfileId(profileId));

        // テスト用のユーザー情報が存在しない場合、エラーを投げる。
        if (responseFindByProfileId == null) throw new Error("The user does not exist.");

        const id = responseFindByProfileId.id;
        await delayAsync(() => posgresUserRepository.delete(id));
        console.info("テスト用のユーザー情報を削除しました。");
    } catch (error) {
        console.info("テスト用のユーザー情報は存在しませんでした。");
    }
});

describe("getUser", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("getUser should return an AuthenticatedUser.", async () => {
        // テスト用のユーザーを登録する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // テスト用のユーザー情報を登録する。
        const authenticationProviderId = responseSignUp.localId;
        const userName = "test@Unicorn";
        await delayAsync(() => posgresUserRepository.create(profileId, authenticationProviderId, userName));

        // 認証済みユーザーを取得する。
        const idToken = responseSignUp.idToken;
        const response = await delayAsync(() => authenticatedUserLoader.getUser(idToken));

        // ユーザーが存在しない場合、エラーを投げる。
        if (response === null) throw new Error("The user does not exist.");

        // 結果を検証する。
        expect(response.id).toBeDefined();
        expect(response.profileId).toBe(profileId);
        expect(response.authenticationProviderId).toBeDefined();
        expect(response.userName).toBe(userName);
        expect(response.createdAt).toBeInstanceOf(Date);
    });
});