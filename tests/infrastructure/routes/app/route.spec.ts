import { describe, test, expect, beforeEach } from "@jest/globals";
import delayAsync from "../../../test-utilityies/delay-async";
import FirebaseClient from "../../../../app/libraries/firebase/firebase-client";
import { AppLoadContext } from "@netlify/remix-runtime";
import { loader, action } from "../../../../app/routes/app/route";
import { appLoadContext } from "../../../../app/dependency-injector/get-load-context";
import { userAuthenticationCookie } from "../../../../app/cookies.server";

/**
 * Firebaseのクライアント。
 */
let firebaseClient: FirebaseClient;

/**
 * テスト用のメールアドレス。
 */
const mailAddress = "test@example.com";

/**
 * テスト用のパスワード。
 */
const password = "testPassword123";

/**
 * コンテキスト。
 */
let context: AppLoadContext;

/**
 * クッキーが不正なモックリクエスト。
 */
let requestWithInvalidCookie: Request;

beforeEach(async () => {
    // Firebaseのクライアントを生成する。
    firebaseClient = new FirebaseClient();

    // テスト用のユーザーが存在する場合、削除する。
    try {
        // テスト用のユーザーをログインする。
        const responseSignIn = await delayAsync(() => firebaseClient.signInWithEmailPassword(mailAddress, password));

        // テスト用のユーザーを削除する。
        const idToken = responseSignIn.idToken;
        await delayAsync(() => firebaseClient.deleteUser(idToken));
        console.info("テスト用のユーザーを削除しました。");
    } catch (error) {
        console.info("テスト用のユーザーは存在しませんでした。");
    }

    // コンテキストを設定する。
    context = appLoadContext;

    // クッキーが不正なモックリクエストを作成する。
    requestWithInvalidCookie = new Request("https://example.com", {
        headers: {
            Cookie: await userAuthenticationCookie.serialize({
                idToken: "invalidIdToken",
                refreshToken: "invalidRefreshToken",
            }),
        },
    });
});

describe("loader", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("Loader should return FF14SNS user.", async () => {
        // テスト用のユーザーを作成する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));
        const requestWithCookie = new Request("https://example.com", {
            headers: {
                Cookie: await userAuthenticationCookie.serialize({
                    idToken: responseSignUp.idToken,
                    refreshToken: responseSignUp.refreshToken,
                }),
            },
        });

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
            name: mailAddress,
        };
        expect(resultUser).toEqual(expectedUser);
    });

    test("Loader should redirect to login page if an error occurs.", async () => {
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
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("Action shoula logout and delete cookies.", async () => {
        // テスト用のユーザーを作成する。
        const responseSignUp = await delayAsync(() => firebaseClient.signUp(mailAddress, password));
        const requestWithCookie = new Request("https://example.com", {
            headers: {
                Cookie: await userAuthenticationCookie.serialize({
                    idToken: responseSignUp.idToken,
                    refreshToken: responseSignUp.refreshToken,
                }),
            },
        });

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

    test("Action should redirect to login page if an error occurs.", async () => {
        // TODO: ログアウトの処理を実装していないので後に実装する。
        // expect.assertions(3);
        // try {
        //     // アクションを実行し、エラーを発生させる。
        //     await action({
        //         request: requestWithInvalidCookie,
        //         params: {},
        //         context,
        //     });
        // } catch (error) {
        //     // エラーがResponseでない場合、エラーを投げる。
        //     if (!(error instanceof Response)) {
        //         throw error;
        //     }

        //     // 検証に必要な情報を取得する。
        //     const status = error.status;
        //     const redirect = error.headers.get("Location");
        //     const cookie = await userAuthenticationCookie.parse(error.headers.get("Set-Cookie"));

        //     // 結果を検証する。
        //     expect(status).toBe(302);
        //     expect(redirect).toBe("/auth/login");
        //     expect(cookie).toStrictEqual({});
        // }
    });
});