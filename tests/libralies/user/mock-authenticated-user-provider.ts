import IAuthenticatedUserProvider from "../../../app/libraries/user/i-authenticated-user-provider";

export default class MockAuthenticatedUserProvider implements IAuthenticatedUserProvider {
    getUser(token: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
}