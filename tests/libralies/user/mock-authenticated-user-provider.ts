import FF14SnsUser from "../../../app/libraries/user/ff14-sns-user";
import IAuthenticatedUserProvider from "../../../app/libraries/user/i-authenticated-user-provider";

export default class MockAuthenticatedUserProvider implements IAuthenticatedUserProvider {
    getUser(token: string): Promise<FF14SnsUser> {
        throw new Error("Method not implemented.");
    }
}