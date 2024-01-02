import { describe, test, expect, beforeEach } from "@jest/globals";
import { AppLoadContext } from "@netlify/remix-runtime";
import { action } from "../../../app/routes/auth.login/route";
import appLoadContext from "../../dependency-injector/app-load-context";
import { userAuthenticationCookie } from "../../../app/cookies.server";

/**
 * リクエスト。
 */
let request: Request;

/**
 * メールアドレスが不正なリクエスト。
 */
let requestWithInvalidEmail: Request;

/**
 * パスワードが不正なリクエスト。
 */
let requestWithInvalidPassword: Request;

/**
 * モックコンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    request = new Request("https://example.com", {
        method: "POST",
        body: new URLSearchParams({
            mailAddress: "test@example.com",
            password: "testPassword123",
        }),
    });
    requestWithInvalidEmail = new Request("https://example.com", {
        method: "POST",
        body: new URLSearchParams({
            mailAddress: "invalid-email",
            password: "testPassword123",
        }),
    });
    requestWithInvalidPassword = new Request("https://example.com", {
        method: "POST",
        body: new URLSearchParams({
            mailAddress: "test@example.com",
            password: "invalid-password",
        }),
    });
    context = appLoadContext;
});

describe("action", () => {
    test("action should redirect app page.", async () => {
        // アクションを実行し、結果を取得する。
        const response = await action({
            request,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const status = response.status;
        const location = response.headers.get("Location");
        const cookie = (await userAuthenticationCookie.parse(response.headers.get("Set-Cookie")));

        // 結果を検証する。
        expect(status).toBe(302);
        expect(location).toBe("/app");
        expect(cookie).toEqual({
            idToken: "idToken",
            refreshToken: "refreshToken",
        });
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

    test("action should return error information for invalid password.", async () => {
        // 無効なパスワードでアクションを実行し、結果を取得する。
        const response = await action({
            request: requestWithInvalidPassword,
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