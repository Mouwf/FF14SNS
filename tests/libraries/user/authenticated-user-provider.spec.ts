import { describe, test, expect, beforeEach } from "@jest/globals";
import MockAuthenticationClient from "../../libraries/authentication/mock-authentication-client";
import AuthenticatedUserProvider from "../../../app/libraries/user/authenticated-user-provider";

/**
 * 認証済みユーザーを提供するクラス。
 */
let authenticatedUserProvider: AuthenticatedUserProvider;

beforeEach(() => {
    const mockAuthenticationClient = new MockAuthenticationClient();
    authenticatedUserProvider = new AuthenticatedUserProvider(mockAuthenticationClient);
});

describe("getUser", () => {
    test("getUser should return a FF14SnsUser.", async () => {
        // FF14SNSのユーザーを取得する。
        const idToken = "idToken";
        const response = await authenticatedUserProvider.getUser(idToken);

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

    test("getUser should throw an error for an invalid token.", async () => {
        expect.assertions(1);
        try {
            // 無効なIDトークンでFF14SNSのユーザーを取得し、エラーを発生させる。
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