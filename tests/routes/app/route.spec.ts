import { describe, test, expect, beforeEach } from "@jest/globals";
import { AppLoadContext } from "@netlify/remix-runtime";
import { loader } from "../../../app/routes/app/route";
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
 * モックコンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    requestWithoutCookie = new Request('https://example.com');
    requestWithCookie = new Request('https://example.com', {
        headers: {
            Cookie: await userAuthenticationCookie.serialize({
                idToken: 'idToken',
                refreshToken: 'refreshToken',
            }),
        },
    });
    context = appLoadContext;
});

describe('loader', () => {
    test('Loader returns FF14SNS user.', async () => {
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
            name: 'UserName',
        };
        expect(result).toEqual(expected);
    });

    test('Loader redirects login page, if user is not authenticated.', async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: requestWithoutCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const status = response.status;
        const redirect = response.headers.get('Location');

        // 結果を検証する。
        expect(status).toBe(302);
        expect(redirect).toBe('/auth/login');
    });
});
