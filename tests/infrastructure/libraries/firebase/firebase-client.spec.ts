import { describe, test, expect, beforeEach } from "@jest/globals";
import FirebaseClient from "../../../../app/libraries/firebase/firebase-client";

/**
 * Firebaseのクライアント。
 */
let firebaseClient: FirebaseClient;

/**
 * テスト用のメールアドレス。
 */
const mailAddress = "test@example.com";

/**
 * テスト用のパスワード。
 */
const password = "testPassword123";



beforeEach(async () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        return;
    }

    // Firebaseのクライアントを生成する。
    firebaseClient = new FirebaseClient();

    // テスト用のユーザーが存在する場合、削除する。
    try {
        const response = await firebaseClient.signInWithEmailPassword(mailAddress, password);
        firebaseClient.deleteUser(response.idToken);
        console.log("テスト用のユーザーを削除しました。");
    } catch (error) {
        console.log("テスト用のユーザーは存在しませんでした。");
    }
});

describe("signUp", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("signUp should create a new user", async () => {
        // テスト用のユーザーを作成する。
        const response = await firebaseClient.signUp(mailAddress, password);

        // 結果を検証する。
        expect(response).toBeDefined();
        expect(response.idToken).toBeDefined();
        expect(response.email).toBe(mailAddress);
        expect(response.refreshToken).toBeDefined();
        expect(response.expiresIn).toBeDefined();
        expect(response.localId).toBeDefined();
    });

    test("signUp should throw an error for invalid input.", async () => {
        expect.assertions(1);
        try {
            // 無効なメールアドレスでサインアップし、エラーを発生させる。
            const invalidMailAddress = "invalidEmail";
            const invalidPassword = "password";
            await firebaseClient.signUp(invalidMailAddress, invalidPassword);
        } catch (error) {
            // エラーを検証する。
            expect(error).toBeDefined();
        }
    });
});

describe("signInWithEmailPassword", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("signInWithEmailPassword should authenticate a user.", async () => {
        // テスト用のユーザーを作成する。
        await firebaseClient.signUp(mailAddress, password);

        // テスト用のユーザーでサインインする。
        const response = await firebaseClient.signInWithEmailPassword(mailAddress, password);

        // 結果を検証する。
        expect(response).toBeDefined();
        expect(response.idToken).toBeDefined();
        expect(response.email).toBe(mailAddress);
        expect(response.refreshToken).toBeDefined();
        expect(response.expiresIn).toBeDefined();
        expect(response.localId).toBeDefined();
    });

    test("signInWithEmailPassword should throw an error for invalid credentials.", async () => {
        expect.assertions(1);
        try {
            // テスト用のユーザーを作成する。
            await firebaseClient.signInWithEmailPassword(mailAddress, password);

            // 無効なパスワードでサインインし、エラーを発生させる。
            const invalidPassword = "invalidPassword";
            await firebaseClient.signInWithEmailPassword(mailAddress, invalidPassword);
        } catch (error) {
            // エラーを検証する。
            expect(error).toBeDefined();
        }
    });
});

describe("getUserInformation", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("getUserInformation should return user information.", async () => {
        // テスト用のユーザーを作成する。
        await firebaseClient.signUp(mailAddress, password);

        // テスト用のユーザーでサインインする。
        const responseSingn = await firebaseClient.signInWithEmailPassword(mailAddress, password);

        // テスト用のユーザーの情報を取得する。
        const response = await firebaseClient.getUserInformation(responseSingn.idToken);

        // 結果を検証する。
        expect(response).toBeDefined();
        expect(response.users).toBeDefined();
        expect(response.users.length).toBe(1);
        expect(response.users[0].localId).toBeDefined();
        expect(response.users[0].email).toBe(mailAddress);
        expect(response.users[0].lastLoginAt).toBeDefined();
        expect(response.users[0].createdAt).toBeDefined();
    });

    test("getUserInformation should throw an error for invalid token.", async () => {
        expect.assertions(1);
        try {
            // 無効なトークンでユーザー情報を取得し、エラーを発生させる。
            await firebaseClient.getUserInformation("invalidToken");
        } catch (error) {
            // エラーを検証する。
            expect(error).toBeDefined();
        }
    });
});