import { describe, test, expect, beforeEach } from "@jest/globals";
import { AppLoadContext } from "@remix-run/node";
import { loader, action } from "../../../app/routes/app/route";
import { appLoadContext } from "../../../app/dependency-injector/get-load-context";
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
 * 登録されていないクッキー付きのモックリクエスト。
 */
let requestWithNotRegisteredUserCookie: Request;

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
    requestWithNotRegisteredUserCookie = new Request("https://example.com", {
        headers: {
            Cookie: await userAuthenticationCookie.serialize({
                idToken: "notRegisteredUserIdToken",
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
    test("loader should return SNS user.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: requestWithCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const resultUser = await response.json();

        // 結果を検証する。
        const expectedUser = {
            userName: "UserName@World",
        };
        expect(resultUser.userName).toBe(expectedUser.userName);
    });

    test("loader should redirect login page if user is not authenticated.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
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
        expect(redirect).toBe("/auth/login");
        expect(cookie).toStrictEqual({});
    });

    test("loader should redirect to user registration page if user is not registered.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: requestWithNotRegisteredUserCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const status = response.status;
        const redirect = response.headers.get("Location");

        // 結果を検証する。
        expect(status).toBe(302);
        expect(redirect).toBe("/auth/register-user");
    });

    test("loader should redirect to login page if an error occurs.", async () => {
        expect.assertions(3);
        try {
            // ローダーを実行し、エラーを発生させる。
            await loader({
                request: requestWithInvalidCookie,
                params: {},
                context,
            });
        } catch (error) {
            // エラーがResponseでない場合、エラーを投げる。
            if (!(error instanceof Response)) {
                throw error;
            }

            // 検証に必要な情報を取得する。
            const status = error.status;
            const redirect = error.headers.get("Location");
            const cookie = await userAuthenticationCookie.parse(error.headers.get("Set-Cookie"));

            // 結果を検証する。
            expect(status).toBe(302);
            expect(redirect).toBe("/auth/login");
            expect(cookie).toStrictEqual({});
        }
    });
});

describe("action", () => {
    test("action shoula logout and delete cookies.", async () => {
        // アクションを実行し、結果を取得する。
        const response = await action({
            request: requestWithCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const status = response.status;
        const redirect = response.headers.get("Location");
        const cookie = await userAuthenticationCookie.parse(response.headers.get("Set-Cookie"));

        // 結果を検証する。
        expect(status).toBe(302);
        expect(redirect).toBe("/auth/login");
        expect(cookie).toStrictEqual({});
    });

    test("action should redirect login page if user is not authenticated.", async () => {
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
        expect(redirect).toBe("/auth/login");
        expect(cookie).toStrictEqual({});
    });

    // TODO: リフレッシュトークンを無効にしてログアウトする処理を追加した後にコメントアウトを外す。
    // test("action should redirect to login page if an error occurs.", async () => {
    //     expect.assertions(3);
    //     try {
    //         // アクションを実行し、エラーを発生させる。
    //         await action({
    //             request: requestWithInvalidCookie,
    //             params: {},
    //             context,
    //         });
    //     } catch (error) {
    //         // エラーがResponseでない場合、エラーを投げる。
    //         if (!(error instanceof Response)) {
    //             throw error;
    //         }

    //         // 検証に必要な情報を取得する。
    //         const status = error.status;
    //         const redirect = error.headers.get("Location");
    //         const cookie = await userAuthenticationCookie.parse(error.headers.get("Set-Cookie"));

    //         // 結果を検証する。
    //         expect(status).toBe(302);
    //         expect(redirect).toBe("/auth/login");
    //         expect(cookie).toStrictEqual({});
    //     }
    // });
});