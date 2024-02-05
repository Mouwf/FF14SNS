import { describe, test, expect, beforeEach } from "@jest/globals";
import { action, loader } from "../../../app/routes/app.setting/route";
import { AppLoadContext } from "@remix-run/node";
import { appLoadContext } from "../../../app/dependency-injector/get-load-context";
import { commitSession, getSession } from "../../../app/sessions";

/**
 * クッキーとボディ付きのモックリクエスト。
 */
let requestWithCookieAndBody: Request;

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
    requestWithCookieAndBody = new Request("https://example.com", {
        headers: {
            Cookie: await commitSession(validSession),
        },
        method: "POST",
        body: new URLSearchParams({
            userName: "UserName@World",
            currentReleaseInformationId: "1",
        }),
    });
    const invalidSession = await getSession();
    invalidSession.set("idToken", "idToken");
    invalidSession.set("refreshToken", "refreshToken");
    invalidSession.set("userId", "username_world2");
    requestWithInvalidCookie = new Request("https://example.com", {
        headers: {
            Cookie: await commitSession(invalidSession),
        },
        method: "POST",
        body: new URLSearchParams({
            userName: "UserName@World",
            currentReleaseInformationId: "1",
        }),
    });
    context = appLoadContext;
});

describe("loader", () => {
    test("loader should return user setting and all release information.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: requestWithCookieAndBody,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const responseJson = await response.json();
        const userSetting = responseJson.userSetting;
        const allReleaseInformation = responseJson.allReleaseInformation;

        // 結果を検証する。
        expect(userSetting.userId).toBe("username_world1");
        expect(userSetting.userName).toBe("UserName@World1");
        expect(userSetting.currentReleaseInformationId).toBe(1);
        expect(allReleaseInformation.length).toBe(5);
    });
});

describe("action", () => {
    test("action should edit a user setting and return true.", async () => {
        // アクションを実行し、結果を取得する。
        const response = await action({
            request: requestWithCookieAndBody,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const responseJson = await response.json();

        // 結果が存在しない場合、エラーを投げる。
        if (!('success' in responseJson) || !responseJson.success) {
            throw new Error("Response is undefined.");
        }

        // 結果を検証する。
        expect(responseJson.success).toBe(true);
    });

    test("action should throw an error when user id is not exist.", async () => {
        // アクションを実行し、結果を取得する。
        const response = await action({
            request: requestWithInvalidCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const responseJson = await response.json();

        // 結果が存在しない場合、エラーを投げる。
        if (!('error' in responseJson) || !responseJson.error) {
            throw new Error("Response is undefined.");
        }

        // 結果を検証する。
        expect(responseJson.error).toBe("設定の更新に失敗しました。");
    });
});