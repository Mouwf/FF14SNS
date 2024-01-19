import { describe, test, expect, beforeEach } from "@jest/globals";
import MockAuthenticationClient from "../../libraries/authentication/mock-authentication-client";
import MockUserRepository from "../../repositories/user/mock-user-repository";
import AuthenticatedUserProvider from "../../../app/libraries/user/authenticated-user-provider";
import AuthenticatedUserLoader from "../../../app/loaders/user/authenticated-user-loader";

/**
 * 認証済みユーザーを取得するローダー。
 */
let authenticatedUserLoader: AuthenticatedUserLoader;

/**
 * IDトークン。
 */
const idToken = "idToken";

beforeEach(() => {
    const mockauthenticationClient = new MockAuthenticationClient();
    const mockUserRepository = new MockUserRepository();
    const authenticatedUserProvider = new AuthenticatedUserProvider(mockauthenticationClient, mockUserRepository);
    authenticatedUserLoader = new AuthenticatedUserLoader(authenticatedUserProvider);
});

describe("getUser", () => {
    test("getUser should return an AuthenticatedUser.", async () => {
        // 認証済みユーザーを取得する。
        const response = await authenticatedUserLoader.getUser(idToken);

        // ユーザーが存在しない場合、エラーを投げる。
        if (response === null) throw new Error("The user does not exist.");

        // 結果を検証する。
        const expectedUser = {
            id: 1,
            profileId: "profileId",
            authenticationProviderId: "authenticationProviderId",
            userName: "UserName@World",
            createdAt: new Date(),
        }
        expect(response.id).toBe(expectedUser.id);
        expect(response.profileId).toBe(expectedUser.profileId);
        expect(response.authenticationProviderId).toBe(expectedUser.authenticationProviderId);
        expect(response.userName).toBe(expectedUser.userName);
        expect(response.createdAt).toBeInstanceOf(Date);
    });
});

describe("getAuthenticationProviderId", () => {
    test("getAuthenticationProviderId should return an authentication provider ID.", async () => {
        // 認証プロバイダIDを取得する。
        const authenticationProviderId = await authenticatedUserLoader.getAuthenticationProviderId(idToken);

        // 結果を検証する。
        expect(authenticationProviderId).toBe("authenticationProviderId");
    });
});