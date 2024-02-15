import { describe, test, expect, beforeEach } from "@jest/globals";
import { AppLoadContext } from "@remix-run/node";
import { loader, action } from "../../../app/routes/app/route";
import { appLoadContext } from "../../../app/dependency-injector/get-load-context";
import { commitSession, getSession } from "../../../app/sessions";

/**
 * クッキーなしのモックリクエスト。
 */
let requestWithoutCookie: Request;

/**
 * 登録されていないクッキー付きのモックリクエスト。
 */
let requestWithNotRegisteredUserCookie: Request;

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
    const validSession = await getSession();
    validSession.set("idToken", "idToken");
    validSession.set("refreshToken", "refreshToken");
    validSession.set("userId", "username_world1");
    requestWithCookie = new Request("https://example.com", {
        headers: {
            Cookie: await commitSession(validSession),
        },
    });
    const notRegisteredUserSession = await getSession();
    notRegisteredUserSession.set("idToken", "notRegisteredUserIdToken");
    notRegisteredUserSession.set("refreshToken", "refreshToken");
    requestWithNotRegisteredUserCookie = new Request("https://example.com", {
        headers: {
            Cookie: await commitSession(notRegisteredUserSession),
        },
    });
    requestWithoutCookie = new Request("https://example.com");
    const invalidSession = await getSession();
    invalidSession.set("userId", "invalidProfileId");
    invalidSession.set("idToken", "idToken");
    invalidSession.set("refreshToken", "invalidRefreshToken");
    requestWithInvalidCookie = new Request("https://example.com", {
        headers: {
            Cookie: await commitSession(invalidSession),
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
            userId: "username_world1",
            userName: "UserName@World",
        };
        expect(resultUser.userId).toBe(expectedUser.userId);
        expect(resultUser.userName).toBe(expectedUser.userName);
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
        const session = await getSession(response.headers.get("Set-Cookie"));

        // 結果を検証する。
        expect(status).toBe(302);
        expect(redirect).toBe("/auth/register-user");
        expect(session.has("idToken")).toBe(true);
        expect(session.has("refreshToken")).toBe(true);
    });

    test("loader should redirect to login page if user is not authenticated.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: requestWithoutCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const status = response.status;
        const redirect = response.headers.get("Location");
        const session = await getSession(response.headers.get("Set-Cookie"));

        // 結果を検証する。
        expect(status).toBe(302);
        expect(redirect).toBe("/auth/login");
        expect(session.has("idToken")).toBe(false);
        expect(session.has("refreshToken")).toBe(false);
        expect(session.has("userId")).toBe(false);
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
            const session = await getSession(error.headers.get("Set-Cookie"));

            // 結果を検証する。
            expect(status).toBe(302);
            expect(redirect).toBe("/auth/login");
            expect(session.get("userId")).toBeUndefined();
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
        const session = await getSession(response.headers.get("Set-Cookie"));

        // 結果を検証する。
        expect(status).toBe(302);
        expect(redirect).toBe("/auth/login");
        expect(session.has("idToken")).toBe(false);
        expect(session.has("refreshToken")).toBe(false);
        expect(session.has("userId")).toBe(false);
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
    //         const cookie = await getSession(error.headers.get("Set-Cookie"));

    //         // 結果を検証する。
    //         expect(status).toBe(302);
    //         expect(redirect).toBe("/auth/login");
    //         expect(cookie).toStrictEqual({});
    //     }
    // });
});