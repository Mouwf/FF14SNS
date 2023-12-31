import IUserAuthenticator from "../../../app/libraries/authentication/i-user-authenticator";

export default class MockUserAuthenticator implements IUserAuthenticator {
    login(mailAddress: string, password: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    logout(): Promise<any> {
        throw new Error("Method not implemented.");
    }
}