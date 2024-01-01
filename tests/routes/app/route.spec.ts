import { describe, test, expect, beforeEach } from "@jest/globals";
import { AppLoadContext } from "@netlify/remix-runtime";
import { loader, action } from "../../../app/routes/app/route";
import appLoadContext from "../../dependency-injector/app-load-context";
import { userAuthenticationCookie } from "../../../app/cookies.server";

/**
 * クッキーなしのモックリクエスト。
 */
let requestWithoutCookie: Request;

/**
 * クッキー付きのモックリクエスト。
 */
let requestWithCookie: Request;

/**
 * クッキーが不正なモックリクエスト。
 */
let requestWithInvalidCookie: Request;

/**
 * モックコンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    requestWithoutCookie = new Request("https://example.com");
    requestWithCookie = new Request("https://example.com", {
        headers: {
            Cookie: await userAuthenticationCookie.serialize({
                idToken: "idToken",
                refreshToken: "refreshToken",
            }),
        },
    });
    requestWithInvalidCookie = new Request("https://example.com", {
        headers: {
            Cookie: await userAuthenticationCookie.serialize({
                idToken: "invalidIdToken",
                refreshToken: "invalidRefreshToken",
            }),
        },
    });
    context = appLoadContext;
});

describe("loader", () => {
    test("Loader returns FF14SNS user.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: requestWithCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const result = await response.json();

        // 結果を検証する。
        const expected = {
            name: "UserName",
        };
        expect(result).toEqual(expected);
    });

    test("Loader redirects login page, if user is not authenticated.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: requestWithoutCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const status = response.status;
        const redirect = response.headers.get("Location");
        const cookie = (await userAuthenticationCookie.parse(response.headers.get("Set-Cookie")));

        // 結果を検証する。
        expect(status).toBe(302);
        expect(redirect).toBe("/auth/login");
        expect(cookie).toStrictEqual({});
    });

    test("Loader redirects to login page if an error occurs.", async () => {
        expect.assertions(3);
        try {
            // ローダーを実行し、エラーを発生させる。
            await loader({
                request: requestWithInvalidCookie,
                params: {},
                context,
            });
        } catch (error) {
            // エラーが Response でない場合、エラーを投げる。
            if (!(error instanceof Response)) {
                throw error;
            }

            // 検証に必要な情報を取得する。
            const status = error.status;
            const redirect = error.headers.get("Location");
            const cookie = (await userAuthenticationCookie.parse(error.headers.get("Set-Cookie")));

            // 結果を検証する。
            expect(status).toBe(302);
            expect(redirect).toBe("/auth/login");
            expect(cookie).toStrictEqual({});
        }
    });
});

describe("action", () => {
    test("Action logs out and deletes cookies.", async () => {
        // アクションを実行し、結果を取得する。
        const response = await action({
            request: requestWithCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const status = response.status;
        const redirect = response.headers.get("Location");
        const cookie = (await userAuthenticationCookie.parse(response.headers.get("Set-Cookie")));

        // 結果を検証する。
        expect(status).toBe(302);
        expect(redirect).toBe("/auth/login");
        expect(cookie).toStrictEqual({});
    });

    test("Action redirects login page, if user is not authenticated.", async () => {
        // アクションを実行し、結果を取得する。
        const response = await action({
            request: requestWithoutCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const status = response.status;
        const redirect = response.headers.get("Location");
        const cookie = (await userAuthenticationCookie.parse(response.headers.get("Set-Cookie")));

        // 結果を検証する。
        expect(status).toBe(302);
        expect(redirect).toBe("/auth/login");
        expect(cookie).toStrictEqual({});
    });

    test("Action redirects to login page if an error occurs.", async () => {
        expect.assertions(3);
        try {
            // アクションを実行し、エラーを発生させる。
            await action({
                request: requestWithInvalidCookie,
                params: {},
                context,
            });
        } catch (error) {
            // エラーが Response でない場合、エラーを投げる。
            if (!(error instanceof Response)) {
                throw error;
            }

            // 検証に必要な情報を取得する。
            const status = error.status;
            const redirect = error.headers.get("Location");
            const cookie = (await userAuthenticationCookie.parse(error.headers.get("Set-Cookie")));

            // 結果を検証する。
            expect(status).toBe(302);
            expect(redirect).toBe("/auth/login");
            expect(cookie).toStrictEqual({});
        }
    });
});