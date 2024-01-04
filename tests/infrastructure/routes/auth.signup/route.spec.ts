import { describe, test, expect, beforeEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import FirebaseClient from "../../../../app/libraries/firebase/firebase-client";
import { AppLoadContext } from "@netlify/remix-runtime";
import { action, loader } from "../../../../app/routes/auth.signup/route";
import { appLoadContext } from "../../../../app/dependency-injector/get-load-context";
import { userAuthenticationCookie } from "../../../../app/cookies.server";

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

/**
 * モックコンテキスト。
 */
let context: AppLoadContext;

/**
 * メールアドレスとパスワードが正しいモックリクエスト。
 */
let requestWithMailAddressAndPassword: Request;

/**
 * メールアドレスが不正なモックリクエスト。
 */
let requestWithInvalidEmail: Request;

beforeEach(async () => {
    // Firebaseのクライアントを生成する。
    firebaseClient = new FirebaseClient();

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

    // コンテキストを設定する。
    context = appLoadContext;

    // モックリクエストを作成する。
    requestWithMailAddressAndPassword = new Request("https://example.com", {
        method: "POST",
        body: new URLSearchParams({
            mailAddress: mailAddress,
            password: password,
            confirmPassword: password,
        }),
    });
    requestWithInvalidEmail = new Request("https://example.com", {
        method: "POST",
        body: new URLSearchParams({
            mailAddress: "invalid-email",
            password: password,
            confirmPassword: password,
        }),
    });
});

describe("action", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("action should redirect app page.", async () => {
        // アクションを実行し、結果を取得する。
        const response = await action({
            request: requestWithMailAddressAndPassword,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const status = response.status;
        const location = response.headers.get("Location");
        const cookie = await userAuthenticationCookie.parse(response.headers.get("Set-Cookie"));

        // 結果を検証する。
        expect(status).toBe(302);
        expect(location).toBe("/app");
        expect(cookie).toBeDefined();
    });

    test("action should return error information for invalid email.", async () => {
        // 無効なメールアドレスでアクションを実行し、結果を取得する。
        const response = await action({
            request: requestWithInvalidEmail,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const errorInformation = await response.json();

        // 結果を検証する。
        const expectedErrorInformation = {
            error: "ログインに失敗しました。",
        };
        expect(errorInformation).toEqual(expectedErrorInformation);
    });
});