import { describe, test, expect, beforeEach } from "@jest/globals";
import MockAuthenticationClient from "../../libraries/authentication/mock-authentication-client";
import MockUserRepository from "../../repositories/user/mock-user-repository";
import AuthenticatedUserProvider from "../../../app/libraries/user/authenticated-user-provider";
import systemMessages from "../../../app/messages/system-messages";

/**
 * 認証済みユーザーを提供するクラス。
 */
let authenticatedUserProvider: AuthenticatedUserProvider;

/**
 * IDトークン。
 */
const idToken = "idToken";

/**
 * プロフィールID。
 */
const profileId = "username_world1";

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
            profileId: "username_world1",
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

    test("getUserByToken should throw an exception for invalid token.", async () => {
        expect.assertions(1);
        try {
            // 無効なトークンでユーザーを取得し、エラーを発生させる。
            const invalidToken = "invalidIdToken";
            await authenticatedUserProvider.getUserByToken(invalidToken);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe(systemMessages.error.userInformationRetrievalFailed);
        }
    });
});

describe("getUserByProfileId", () => {
    test("getUserByProfileId should return an AuthenticatedUser.", async () => {
        // 認証済みユーザーを取得する。
        const response = await authenticatedUserProvider.getUserByProfileId(profileId);

        // ユーザーが存在しない場合、エラーを投げる。
        if (response === null) throw new Error("The user does not exist.");

        // 結果を検証する。
        const expectedUser = {
            id: 1,
            profileId: "username_world1",
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

    test("getUserByProfileId should throw an exception for not exist profile id.", async () => {
        expect.assertions(1);
        try {
            // 無効なプロフィールIDでユーザーを取得し、エラーを発生させる。
            const invalidProfileId = "notExistProfileId";
            await authenticatedUserProvider.getUserByProfileId(invalidProfileId);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe(systemMessages.error.userInformationRetrievalFailed);
        }
    });
});

describe("getAuthenticationProviderId", () => {
    test("getAuthenticationProviderId should return an authentication provider ID.", async () => {
        // 認証プロバイダIDを取得する。
        const authenticationProviderId = await authenticatedUserProvider.getAuthenticationProviderId(idToken);

        // 結果を検証する。
        expect(authenticationProviderId).toBe("authenticationProviderId");
    });

    test("getAuthenticationProviderId should throw an exception for invalid token.", async () => {
        expect.assertions(1);
        try {
            // 無効なトークンで認証プロバイダIDを取得し、エラーを発生させる。
            const invalidToken = "invalidIdToken";
            await authenticatedUserProvider.getAuthenticationProviderId(invalidToken);
        } catch (error) {
            // エラーがErrorでない場合、エラーを投げる。
            if (!(error instanceof Error)) {
                throw error;
            }

            // エラーを検証する。
            expect(error.message).toBe(systemMessages.error.authenticationFailed);
        }
    });
});