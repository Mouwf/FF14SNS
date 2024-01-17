import { describe, test, expect, beforeEach } from "@jest/globals";
import { action } from "../../../app/routes/auth.register-user/route";
import { AppLoadContext } from "@netlify/remix-runtime";
import appLoadContext from "../../dependency-injector/app-load-context";
import { userAuthenticationCookie } from "../../../app/cookies.server";

/**
 * クッキー付きのモックリクエスト。
 */
let requestWithCookie: Request;

/**
 * ユーザー名が未入力なモックリクエスト。
 */
let requestWithNotInputUserName: Request;

/**
 * ユーザー名が未入力なモックリクエスト。
 */
let requestWithInvalidUserName: Request;

/**
 * クッキーなしのモックリクエスト。
 */
let requestWithoutCookie: Request;

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
        method: "POST",
        body: new URLSearchParams({
            userName: "userName",
        }),
    });
    requestWithNotInputUserName = new Request("https://example.com", {
        headers: {
            Cookie: await userAuthenticationCookie.serialize({
                idToken: "idToken",
                refreshToken: "refreshToken",
            }),
        },
        method: "POST",
        body: new URLSearchParams({
            userName: "",
        }),
    });
    requestWithInvalidUserName = new Request("https://example.com", {
        headers: {
            Cookie: await userAuthenticationCookie.serialize({
                idToken: "idToken",
                refreshToken: "refreshToken",
            }),
        },
        method: "POST",
        body: new URLSearchParams({
            userName: "invalidUserName",
        }),
    });
    requestWithoutCookie = new Request("https://example.com");
    context = appLoadContext;
});

describe("action", () => {
    test("action should redirect app page.", async () => {
        // アクションを実行し、結果を取得する。
        const response = await action({
            request: requestWithCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const status = response.status;
        const location = response.headers.get("Location");

        // 結果を検証する。
        expect(status).toBe(302);
        expect(location).toBe("/app");
    });

    test("action should redirect register user page if user is not loged in.", async () => {
        // アクションを実行し、結果を取得する。
        const response = await action({
            request: requestWithoutCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const status = response.status;
        const redirect = response.headers.get("Location");
        const cookie = await userAuthenticationCookie.parse(response.headers.get("Set-Cookie"));

        // 結果を検証する。
        expect(status).toBe(302);
        expect(redirect).toBe("/auth/register-user");
        expect(cookie).toStrictEqual({});
    });

    test("action should return error information for not input user name.", async () => {
        // アクションを実行し、結果を取得する。
        const response = await action({
            request: requestWithNotInputUserName,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const errorInformation = await response.json();

        // 結果を検証する。
        const expectedErrorInformation = {
            error: "ユーザー名が入力されていません。",
        };
        expect(errorInformation).toEqual(expectedErrorInformation);
    });

    test("loader should redirect to login page if an error occurs.", async () => {
        // アクションを実行し、結果を取得する。
        const response = await action({
            request: requestWithInvalidUserName,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const errorInformation = await response.json();

        // 結果を検証する。
        const expectedErrorInformation = {
            error: "ユーザー登録に失敗しました。",
        };
        expect(errorInformation).toEqual(expectedErrorInformation);
    });
});