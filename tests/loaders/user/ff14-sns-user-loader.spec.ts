import { describe, test, expect, beforeEach } from "@jest/globals";
import FF14SnsUserLoader from "../../../app/loaders/user/ff14-sns-user-loader";
import MockAuthenticatedUserProvider from "../../libraries/user/mock-authenticated-user-provider";

/**
 * FF14SNSのユーザーを取得するローダー。
 */
let ff14SnsUserLoader: FF14SnsUserLoader;

beforeEach(() => {
    const mockAuthenticatedUserProvider = new MockAuthenticatedUserProvider();
    ff14SnsUserLoader = new FF14SnsUserLoader(mockAuthenticatedUserProvider);
});

describe("getUser", () => {
    test("getUser should return a FF14SnsUser object for a valid token", async () => {
        // FF14SNSのユーザーを取得する。
        const resultUser = await ff14SnsUserLoader.getUser("idToken");

        // 結果を検証する。
        const expectedUser = {
            name: "UserName",
        }
        expect(resultUser).toEqual(expectedUser);
    });

    test("getUser should throw an error for an invalid token", async () => {
        expect.assertions(1);
        try {
            // 無効なIDトークンでFF14SNSのユーザーを取得し、エラーを発生させる。
            await ff14SnsUserLoader.getUser("invalidIdToken");
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