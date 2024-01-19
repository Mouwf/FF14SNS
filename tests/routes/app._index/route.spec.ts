import { describe, test, expect, beforeEach } from "@jest/globals";
import { AppLoadContext } from "@netlify/remix-runtime";
import appLoadContext from "../../dependency-injector/app-load-context";
import { loader } from "../../../app/routes/app._index/route";
import { newlyPostedPostCookie } from "../../../app/cookies.server";

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
    requestWithoutCookie = new Request("https://example.com");
    requestWithCookie = new Request("https://example.com", {
        headers: {
            Cookie: await newlyPostedPostCookie.serialize({
                releaseVersion: "パッチ5",
                tag: "タグ2",
                content: "クッキー経由の投稿テスト！",
                isPosted: true,
            }),
        },
    });
    context = appLoadContext;
});

describe("loader", () => {
    test("loader should return 10 PostContent objects.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: requestWithoutCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const resultPostContents = await response.json();

        // 結果を検証する。
        expect(resultPostContents.length).toBe(10);
    });

    test("loader should return 11 PostContent objects with cookie.", async () => {
        // ローダーを実行し、結果を取得する。
        const response = await loader({
            request: requestWithCookie,
            params: {},
            context,
        });

        // 検証に必要な情報を取得する。
        const resultPostContents = await response.json();

        // 結果を検証する。
        const expectedUserPost = {
            id: 100,
            releaseVersion: "パッチ5",
            tag: "タグ2",
            content: "クッキー経由の投稿テスト！",
        }
        expect(resultPostContents.length).toBe(11);
        expect(resultPostContents[0].id).toBe(expectedUserPost.id);
        expect(resultPostContents[0].releaseVersion).toBe(expectedUserPost.releaseVersion);
        expect(resultPostContents[0].tag).toBe(expectedUserPost.tag);
        expect(resultPostContents[0].content).toBe(expectedUserPost.content);
    });
});