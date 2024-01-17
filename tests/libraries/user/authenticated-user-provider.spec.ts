import { describe, test, expect, beforeEach } from "@jest/globals";
import MockAuthenticationClient from "../../libraries/authentication/mock-authentication-client";
import MockUserRepository from "../../repositories/user/mock-user-repository";
import AuthenticatedUserProvider from "../../../app/libraries/user/authenticated-user-provider";

/**
 * 認証済みユーザーを提供するクラス。
 */
let authenticatedUserProvider: AuthenticatedUserProvider;

beforeEach(() => {
    const mockAuthenticationClient = new MockAuthenticationClient();
    const mockUserRepository = new MockUserRepository();
    authenticatedUserProvider = new AuthenticatedUserProvider(mockAuthenticationClient, mockUserRepository);
});

describe("getUser", () => {
    test("getUser should return an AuthenticatedUser.", async () => {
        // 認証済みユーザーを取得する。
        const idToken = "idToken";
        const response = await authenticatedUserProvider.getUser(idToken);

        // ユーザーが存在しない場合、エラーを投げる。
        if (response === null) throw new Error("The user does not exist.");

        // 結果を検証する。
        const expectedUser = {
            id: "id",
            profileId: "profileId",
            authenticationProviderId: "authenticationProviderId",
            userName: "userName",
            createdAt: new Date(),
        }
        expect(response.id).toBe(expectedUser.id);
        expect(response.profileId).toBe(expectedUser.profileId);
        expect(response.authenticationProviderId).toBe(expectedUser.authenticationProviderId);
        expect(response.userName).toBe(expectedUser.userName);
        expect(response.createdAt).toBeInstanceOf(Date);
    });

    test("getUser should return null if the user does not exist.", async () => {
        // テスト用のユーザーを登録する。
        const idToken = "idToken";
        const response = await authenticatedUserProvider.getUser(idToken);

        // 結果を検証する。
        expect(response).toBeNull();
    });

    test("getUser should throw an error for an invalid token.", async () => {
        expect.assertions(1);
        try {
            // 無効なIDトークンで認証済みユーザーを取得し、エラーを発生させる。
            await authenticatedUserProvider.getUser("invalidIdToken");
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe("Invalid token.");
        }
    });
});