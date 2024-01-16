import { describe, test, expect, beforeEach } from "@jest/globals";
import { AppLoadContext } from "@netlify/remix-runtime";
import { action, loader } from "../../../app/routes/auth.signup/route";
import appLoadContext from "../../dependency-injector/app-load-context";
import { userAuthenticationCookie } from "../../../app/cookies.server";

/**
 * クッキー付きのモックリクエスト。
 */
let requestWithCookie: Request;

/**
 * クッキーなしのモックリクエスト。
 */
let requestWithoutCookie: Request;

/**
 * メールアドレスとパスワードが正しいモックリクエスト。
 */
let requestWithMailAddressAndPassword: Request;

/**
 * メールアドレスが不正なモックリクエスト。
 */
let requestWithInvalidEmail: Request;

/**
 * パスワードが不一致なモックリクエスト。
 */
let requestWithMismatchedPassword: Request;

/**
 * パスワードが不正なモックリクエスト。
 */
let requestWithInvalidPassword: Request;

/**
 * モックコンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    requestWithCookie = new Request("https://example.com", {
        headers: {
            Cookie: await userAuthenticationCookie.serialize({
                idToken: "idToken",
                refreshToken: "refreshToken",
            }),
        },
    });
    requestWithoutCookie = new Request("https://example.com");
    requestWithMailAddressAndPassword = new Request("https://example.com", {
        method: "POST",
        body: new URLSearchParams({
            mailAddress: "test@example.com",
            password: "testPassword123",
            confirmPassword: "testPassword123",
        }),
    });
    requestWithInvalidEmail = new Request("https://example.com", {
        method: "POST",
        body: new URLSearchParams({
            mailAddress: "invalid-email",
            password: "testPassword123",
            confirmPassword: "testPassword123",
        }),
    });
    requestWithMismatchedPassword = new Request("https://example.com", {
        method: "POST",
        body: new URLSearchParams({
            mailAddress: "test@example.com",
            password: "testPassword123",
            confirmPassword: "mismatchedPassword",
        }),
    });
    requestWithInvalidPassword = new Request("https://example.com", {
        method: "POST",
        body: new URLSearchParams({
            mailAddress: "test@example.com",
            password: "invalid-password",
            confirmPassword: "invalid-password",
        }),
    });
    context = appLoadContext;
});

describe("loader", () => {
    test("loader should redirect app page if user is already authenticated.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: requestWithCookie,
            params: {},
            context,
        });

        // 結果が存在しない場合、エラーを投げる。
        if (!response) {
            throw new Error("Response is undefined.");
        }

        // 検証に必要な情報を取得する。
        const status = response.status;
        const location = response.headers.get("Location");

        // 結果を検証する。
        expect(status).toBe(302);
        expect(location).toBe("/app");
    });

    test("loader should return null if user is not authenticated.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: requestWithoutCookie,
            params: {},
            context,
        });

        // 結果を検証する。
        expect(response).toBeNull();
    });
});

describe("action", () => {
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
        expect(location).toBe("/app/register-user");
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

    test("action should return error information for mismatched password.", async () => {
        // パスワードが不一致なリクエストでアクションを実行し、結果を取得する。
        const response = await action({
            request: requestWithMismatchedPassword,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const errorInformation = await response.json();

        // 結果を検証する。
        const expectedErrorInformation = {
            error: "パスワードが一致しません。",
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