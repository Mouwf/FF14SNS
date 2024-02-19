import { describe, test, expect, beforeEach } from "@jest/globals";
import { action, loader } from "../../../app/routes/auth.register-user/route";
import { AppLoadContext } from "@remix-run/node";
import { appLoadContext } from "../../../app/dependency-injector/get-load-context";
import { commitSession, getSession } from "../../../app/sessions";

/**
 * クッキー付きのモックリクエスト。
 */
let requestWithCookie: Request;

/**
 * 登録されているモックリクエスト。
 */
let requestWithLoggedInUserCookie: Request;

/**
 * クッキーなしのモックリクエスト。
 */
let requestWithoutCookie: Request;

/**
 * モックコンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    const validSession = await getSession();
    validSession.set("idToken", "idToken");
    validSession.set("refreshToken", "refreshToken");
    requestWithCookie = new Request("https://example.com", {
        headers: {
            Cookie: await commitSession(validSession),
        },
        method: "POST",
        body: new URLSearchParams({
            userName: "UserName@World",
            currentReleaseInformationId: "1",
        }),
    });
    const loggedInUserSession = await getSession();
    loggedInUserSession.set("idToken", "idToken");
    loggedInUserSession.set("refreshToken", "refreshToken");
    loggedInUserSession.set("userId", "username_world1");
    requestWithLoggedInUserCookie = new Request("https://example.com", {
        headers: {
            Cookie: await commitSession(loggedInUserSession),
        },
        method: "POST",
        body: new URLSearchParams({
            userName: "UserName@World",
            currentReleaseInformationId: "1",
        }),
    });
    requestWithoutCookie = new Request("https://example.com");
    context = appLoadContext;
});

describe("loader", () => {
    test("loader should return all release information.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: requestWithCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const resultAllInformation = await response.json();

        // 配列でない場合、エラーを投げる。
        if (!Array.isArray(resultAllInformation)) {
            throw new Error(resultAllInformation.errorMessage);
        }

        // 結果を検証する。
        expect(resultAllInformation.length).toBeGreaterThan(0);
    });

    test("loader should redirect app page if user is logged in.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: requestWithLoggedInUserCookie,
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

    test("loader should redirect login page if user is not logged in.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: requestWithoutCookie,
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
        expect(location).toBe("/auth/login");
    });
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
        const session = await getSession(response.headers.get("Set-Cookie"));

        // 結果を検証する。
        expect(status).toBe(302);
        expect(location).toBe("/app");
        expect(session.has("idToken")).toBe(true);
        expect(session.has("refreshToken")).toBe(true);
        expect(session.has("userId")).toBe(true);
    });
});