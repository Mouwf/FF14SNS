import SignInWithEmailPasswordResponse from "../../../app/models/firebase/signin-with-email-password-response";
import IUserAuthenticator from "../../../app/libraries/authentication/i-user-authenticator";

export default class MockUserAuthenticator implements IUserAuthenticator {
    login(mailAddress: string, password: string): Promise<SignInWithEmailPasswordResponse> {
        throw new Error("Method not implemented.");
    }

    logout(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}