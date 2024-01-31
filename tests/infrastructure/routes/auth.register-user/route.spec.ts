import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import FirebaseClient from "../../../../app/libraries/authentication/firebase-client";
import { AppLoadContext } from "@remix-run/node";
import { action } from "../../../../app/routes/auth.register-user/route";
import { appLoadContext } from "../../../../app/dependency-injector/get-load-context";
import { commitSession, getSession } from "../../../../app/sessions";

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
 * ユーザー名。
 */
const userName = "UserName@World";

/**
 * コンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    firebaseClient = new FirebaseClient();
    context = appLoadContext;
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("action", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("action should redirect app page.", async () => {
        // テスト用のユーザーを作成する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));

        // アクションを実行し、結果を取得する。
        const session = await getSession();
        session.set("idToken", responseSignUp.idToken);
        session.set("refreshToken", responseSignUp.refreshToken);
        const requestWithCookie = new Request("https://example.com", {
            headers: {
                Cookie: await commitSession(session),
            },
            method: "POST",
            body: new URLSearchParams({
                userName: userName,
            }),
        });
        const response = await action({
            request: requestWithCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const status = response.status;
        const location = response.headers.get("Location");
        const resultSession = await getSession(response.headers.get("Set-Cookie"));

        // 結果を検証する。
        expect(status).toBe(302);
        expect(location).toBe("/app");
        expect(resultSession.has("idToken")).toBe(true);
        expect(resultSession.has("refreshToken")).toBe(true);
        expect(resultSession.has("userId")).toBe(true);
    });
});