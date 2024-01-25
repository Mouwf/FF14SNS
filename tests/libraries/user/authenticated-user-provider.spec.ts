import { describe, test, expect, beforeEach } from "@jest/globals";
import MockAuthenticationClient from "../../libraries/authentication/mock-authentication-client";
import MockUserRepository from "../../repositories/user/mock-user-repository";
import AuthenticatedUserProvider from "../../../app/libraries/user/authenticated-user-provider";

/**
 * 認証済みユーザーを提供するクラス。
 */
let authenticatedUserProvider: AuthenticatedUserProvider;

/**
 * IDトークン。
 */
const idToken = "idToken";

beforeEach(() => {
    const mockAuthenticationClient = new MockAuthenticationClient();
    const mockUserRepository = new MockUserRepository();
    authenticatedUserProvider = new AuthenticatedUserProvider(mockAuthenticationClient, mockUserRepository);
});

describe("getUserByToken", () => {
    test("getUserByToken should return an AuthenticatedUser.", async () => {
        // 認証済みユーザーを取得する。
        const response = await authenticatedUserProvider.getUserByToken(idToken);

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

    test("getUserByToken should return null if the user does not exist.", async () => {
        // テスト用のユーザーを登録する。
        const idTokenForNotExistUser = "idTokenForNotExistUser";
        const response = await authenticatedUserProvider.getUserByToken(idTokenForNotExistUser);

        // 結果を検証する。
        expect(response).toBeNull();
    });
});

describe("getAuthenticationProviderId", () => {
    test("getAuthenticationProviderId should return an authentication provider ID.", async () => {
        // 認証プロバイダIDを取得する。
        const authenticationProviderId = await authenticatedUserProvider.getAuthenticationProviderId(idToken);

        // 結果を検証する。
        expect(authenticationProviderId).toBe("authenticationProviderId");
    });
});