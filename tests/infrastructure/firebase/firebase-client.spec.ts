import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import FirebaseClient from "../../../app/libraries/firebase/firebase-client";

/**
 * Firebaseのクライアント。
 */
let firebaseClient: FirebaseClient;

beforeEach(() => {
    firebaseClient = new FirebaseClient();
});
afterEach(() => {

});

describe("signUp", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("signUp should create a new user", async () => {
        const email = "test@example.com";
        const password = "testPassword123";
        const response = await firebaseClient.signUp(email, password);

        expect(response).toBeDefined();
        expect(response.email).toBe(email);
    });

    test("signUp should throw an error for invalid input", async () => {
        expect.assertions(1);
        try {
            await firebaseClient.signUp("invalidEmail", "password");
        } catch (error) {
            expect(error).toBeDefined();
        }
    });
});

describe("signInWithEmailPassword", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("signInWithEmailPassword should authenticate a user", async () => {
        const email = "test@example.com";
        const password = "testPassword123";
        const response = await firebaseClient.signInWithEmailPassword(email, password);

        expect(response).toBeDefined();
        expect(response.email).toBe(email);
    });

    test("signInWithEmailPassword should throw an error for invalid credentials", async () => {
        expect.assertions(1);
        try {
            await firebaseClient.signInWithEmailPassword("invalid@example.com", "wrongPassword");
        } catch (error) {
            expect(error).toBeDefined();
        }
    });
});

describe("getUserInformation", () => {
    // 環境変数が設定されていない場合、テストをスキップする。
    if (!process.env.RUN_INFRA_TESTS) {
        test.skip("Skipping infrastructure tests.", () => {});
        return;
    }

    test("getUserInformation should return user information", async () => {
        const idToken = "your_id_token"; // 適切なIDトークンを設定
        const response = await firebaseClient.getUserInformation(idToken);

        expect(response).toBeDefined();
    });

    test("getUserInformation should throw an error for invalid token", async () => {
        expect.assertions(1);
        try {
            await firebaseClient.getUserInformation("invalidToken");
        } catch (error) {
            expect(error).toBeDefined();
        }
    });
});