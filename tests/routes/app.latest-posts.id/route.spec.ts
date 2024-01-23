import { describe, test, expect, beforeEach } from "@jest/globals";
import { AppLoadContext } from "@remix-run/node";
import { appLoadContext } from "../../../app/dependency-injector/get-load-context";
import { loader } from "../../../app/routes/app.latest-posts.$id/route";

/**
 * モックリクエスト。
 */
let request: Request;

/**
 * モックコンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    request = new Request("https://example.com");
    context = appLoadContext;
});

describe("loader", () => {
    test("loader should return 1000 PostContent objects.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: request,
            params: {
                id: "10",
            },
            context,
        });

        // 検証に必要な情報を取得する。
        const resultPostContents = await response.json();

        // 結果を検証する。
        expect(resultPostContents.length).toBe(1000);
    });

    test("loader should return an empty object when no parameter is provided.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: request,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const resultPostContents = await response.json();

        // 結果を検証する。
        expect(resultPostContents.length).toBe(0);
    });

    test("loader should return an empty object when the input parameter is an empty string.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: request,
            params: {
                id: "",
            },
            context,
        });

        // 検証に必要な情報を取得する。
        const resultPostContents = await response.json();

        // 結果を検証する。
        expect(resultPostContents.length).toBe(0);
    });
});