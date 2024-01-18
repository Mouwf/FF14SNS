import { describe, test, expect, beforeEach } from "@jest/globals";
import { AppLoadContext } from "@netlify/remix-runtime";
import appLoadContext from "../../dependency-injector/app-load-context";
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
    test("loader should return 10 PostContent objects with ids ranging from 11 to 20.", async () => {
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
        expect(resultPostContents.length).toBe(10);
        expect(resultPostContents[0].id).toBe(11);
        expect(resultPostContents[1].id).toBe(12);
        expect(resultPostContents[2].id).toBe(13);
        expect(resultPostContents[3].id).toBe(14);
        expect(resultPostContents[4].id).toBe(15);
        expect(resultPostContents[5].id).toBe(16);
        expect(resultPostContents[6].id).toBe(17);
        expect(resultPostContents[7].id).toBe(18);
        expect(resultPostContents[8].id).toBe(19);
        expect(resultPostContents[9].id).toBe(20);
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