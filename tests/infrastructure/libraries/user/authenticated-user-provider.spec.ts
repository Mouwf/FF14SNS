import { describe, test, expect, beforeEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import AuthenticatedUserProvider from "../../../../app/libraries/user/authenticated-user-provider";
import FirebaseClient from "../../../../app/libraries/authentication/firebase-client";
import PostgresUserRepository from "../../../../app/repositories/user/postgres-user-repository";

/**
 * Firebaseのクライアント。
 */
let firebaseClient: FirebaseClient;

/**
 * Postgresのユーザーリポジトリ。
 */
let posgresUserRepository: PostgresUserRepository;

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
const profileId = "test_unicorn";

beforeEach(async () => {
    firebaseClient = new FirebaseClient();
    posgresUserRepository = new PostgresUserRepository();
    authenticatedUserProvider = new AuthenticatedUserProvider(firebaseClient, posgresUserRepository);

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

        // テスト用のユーザー情報を取得する。
        const idToken = responseSignUp.idToken;
        const responseUser = await delayAsync(() => authenticatedUserProvider.getUser(idToken));

        // ユーザーが存在しない場合、エラーを投げる。
        if (responseUser === null) throw new Error("The user does not exist.");

        // 結果を検証する。
        const expectedUser = {
            userName: mailAddress,
        };
        expect(responseUser.id).toBeDefined();
        expect(responseUser.profileId).toBe(profileId);
        expect(responseUser.authenticationProviderId).toBeDefined();
        expect(responseUser.userName).toBe(expectedUser.userName);
        expect(new Date(responseUser.createdAt)).toBeInstanceOf(Date);
    });

    test("getUser should return null if the user does not exist.", async () => {
        // テスト用のユーザーを登録する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // ユーザー情報を取得する。
        const idToken = responseSignUp.idToken;
        const responseUser = await delayAsync(() => authenticatedUserProvider.getUser(idToken));
    
        // 結果を検証する。
        expect(responseUser).toBeNull();
    });
});