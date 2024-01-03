import { describe, test, expect, beforeEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import FirebaseUserAccountManager from "../../../../app/libraries/authentication/firebase-user-account-manager";
import FirebaseClient from "../../../../app/libraries/firebase/firebase-client";

/**
 * Firebaseのクライアント。
 */
let firebaseClient: FirebaseClient;

/**
 * Firebaseを利用したユーザー管理を行うクラス。
 */
let firebaseUserAccountManager: FirebaseUserAccountManager;

/**
 * テスト用のメールアドレス。
 */
const mailAddress = "test@example.com";

/**
 * テスト用のパスワード。
 */
const password = "testPassword123";

beforeEach(async () => {
    firebaseClient = new FirebaseClient();
    firebaseUserAccountManager = new FirebaseUserAccountManager();

    // テスト用のユーザーが存在する場合、削除する。
    try {
        // テスト用のユーザーをログインする。
        const responseSignIn = await delayAsync(() => firebaseClient.signInWithEmailPassword(mailAddress, password));

        // テスト用のユーザーを削除する。
        const idToken = responseSignIn.idToken;
        await delayAsync(() => firebaseClient.deleteUser(idToken));
        console.log("テスト用のユーザーを削除しました。");
    } catch (error) {
        console.log("テスト用のユーザーは存在しませんでした。");
    }
});

describe("register", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_FIREBASE_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("register should register a user.", async () => {
        // テスト用のユーザーを登録する。
        const response = await delayAsync(() => firebaseUserAccountManager.register(mailAddress, password));

        // 結果を検証する。
        expect(response).toBeDefined();
    });
});

describe("delete", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_FIREBASE_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("delete should delete a user.", async () => {
        // テスト用のユーザーを登録する。
        const responseRegister = await delayAsync(() => firebaseUserAccountManager.register(mailAddress, password));

        // テスト用のユーザーを削除する。
        const idToken = responseRegister.idToken;
        const response = await delayAsync(() => firebaseUserAccountManager.delete(idToken));

        // 結果を検証する。
        expect(response).toBeTruthy();
    });
});

describe("login", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_FIREBASE_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("login should login a user.", async () => {
        // テスト用のユーザーを登録する。
        await delayAsync(() => firebaseUserAccountManager.register(mailAddress, password));

        // テスト用のユーザーをログインする。
        const response = await delayAsync(() => firebaseUserAccountManager.login(mailAddress, password));

        // 結果を検証する。
        expect(response).toBeTruthy();
    });
});

describe("logout", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_FIREBASE_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("logout should logout a user.", async () => {
        // テスト用のユーザーを登録する。
        const responseRegister = await delayAsync(() => firebaseUserAccountManager.register(mailAddress, password));

        // テスト用のユーザーをログアウトする。
        const idToken = responseRegister.idToken;
        const response = await delayAsync(() => firebaseUserAccountManager.logout(idToken));

        // 結果を検証する。
        expect(response).toBeTruthy();
    });
});