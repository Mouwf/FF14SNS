import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import deleteRecordForTest from "../../../infrastructure/common/delete-record-for-test";
import { AppLoadContext } from "@remix-run/node";
import { action } from "../../../../app/routes/auth.signup/route";
import { appLoadContext } from "../../../../app/dependency-injector/get-load-context";
import { getSession } from "../../../../app/sessions";

/**
 * テスト用のメールアドレス。
 */
const mailAddress = "test@example.com";

/**
 * テスト用のパスワード。
 */
const password = "testPassword123";

/**
 * コンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    context = appLoadContext;
    await deleteRecordForTest();
});

afterEach(async () => {
    await deleteRecordForTest();
});

describe("action", () => {
    test("action should redirect register user page.", async () => {
        // アクションを実行し、結果を取得する。
        const requestWithMailAddressAndPassword = new Request("https://example.com", {
            method: "POST",
            body: new URLSearchParams({
                mailAddress: mailAddress,
                password: password,
                confirmPassword: password,
            }),
        });
        const response = await action({
            request: requestWithMailAddressAndPassword,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const status = response.status;
        const location = response.headers.get("Location");
        const session = await getSession(response.headers.get("Set-Cookie"));

        // 結果を検証する。
        expect(status).toBe(302);
        expect(location).toBe("/auth/register-user");
        expect(session.has("idToken")).toBe(true);
        expect(session.has("refreshToken")).toBe(true);
        expect(session.has("userId")).toBe(false);
    });
});