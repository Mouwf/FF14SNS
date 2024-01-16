import FF14SnsUser from "../../models/user/ff14-sns-user";
import IAuthenticatedUserProvider from "./i-authenticated-user-provider";
import FirebaseClient from "../authentication/firebase-client";

/**
 * Firebaseを利用した認証済みユーザーを提供するクラス。
 */
export default class FirebaseAuthenticatedUserProvider implements IAuthenticatedUserProvider {
    /**
     * FirebaseAppを提供するクラス。
     */
    private readonly firebaseClient = new FirebaseClient();

    public async getUser(token: string): Promise<FF14SnsUser> {
        const response = await this.firebaseClient.getUserInformation(token);
        const ff14SnsUser = {
            name: response.users[0].email,
        };
        return ff14SnsUser;
    }
}