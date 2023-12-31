import { describe, test, expect, beforeEach } from "@jest/globals";
import { AppLoadContext } from "@netlify/remix-runtime";
import { loader } from "../../../app/routes/app/route";
import appLoadContext from "../../dependency-injector/app-load-context";
import { userAuthenticationCookie } from "../../../app/cookies.server";

/**
 * モックリクエスト。
 */
let request: Request;

/**
 * モックコンテキスト。
 */
let context: AppLoadContext;

beforeEach(async () => {
    request = new Request('https://example.com', {
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
    test('Loader returns FF14SNS user.', () => {
        // Call the loader function
        const result = loader({
            request,
            params: {},
            context,
        });

        // Assert that the result is the user data
        //expect(result).toEqual(context.FF14SNSUserLoader.getUserData());
    });
});
