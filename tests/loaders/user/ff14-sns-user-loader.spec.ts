import { describe, test, expect, beforeEach } from "@jest/globals";
import MockAuthenticationClient from "../../../tests/libraries/authentication/mock-authentication-client";
import AuthenticatedUserProvider from "../../../app/libraries/user/authenticated-user-provider";
import FF14SnsUserLoader from "../../../app/loaders/user/ff14-sns-user-loader";

/**
 * FF14SNSのユーザーを取得するローダー。
 */
let ff14SnsUserLoader: FF14SnsUserLoader;

beforeEach(() => {
    const mockauthenticationClient = new MockAuthenticationClient();
    const authenticatedUserProvider = new AuthenticatedUserProvider(mockauthenticationClient);
    ff14SnsUserLoader = new FF14SnsUserLoader(authenticatedUserProvider);
});

describe("getUser", () => {
    test("getUser should return a FF14SnsUser.", async () => {
        // FF14SNSのユーザーを取得する。
        const idToken = "idToken";
        const response = await ff14SnsUserLoader.getUser(idToken);

        // 結果を検証する。
        const expectedUser = {
            id: "id",
            userName: "test@example.com",
            createdAt: new Date(),
        }
        expect(response.id).toBe(expectedUser.id);
        expect(response.userName).toBe(expectedUser.userName);
        expect(response.createdAt).toBeInstanceOf(Date);
    });
});