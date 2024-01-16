import { describe, test, expect, beforeEach } from "@jest/globals";
import MockAuthenticationClient from "../../libraries/authentication/mock-authentication-client";
import AuthenticatedUserProvider from "../../../app/libraries/user/authenticated-user-provider";
import AuthenticatedUserLoader from "../../../app/loaders/user/authenticated-user-loader";

/**
 * 認証済みユーザーを取得するローダー。
 */
let authenticatedUserLoader: AuthenticatedUserLoader;

beforeEach(() => {
    const mockauthenticationClient = new MockAuthenticationClient();
    const authenticatedUserProvider = new AuthenticatedUserProvider(mockauthenticationClient);
    authenticatedUserLoader = new AuthenticatedUserLoader(authenticatedUserProvider);
});

describe("getUser", () => {
    test("getUser should return a AuthenticatedUser.", async () => {
        // 認証済みユーザーを取得する。
        const idToken = "idToken";
        const response = await authenticatedUserLoader.getUser(idToken);

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