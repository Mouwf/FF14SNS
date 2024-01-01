import SignUpResponse from "../../../app/models/firebase/signup-response";
import IUserRegistrar from "../../../app/libraries/authentication/i-user-registrar";

export default class MockUserRegistrar implements IUserRegistrar {
    register(mailAddress: string, password: string): Promise<SignUpResponse> {
        throw new Error("Method not implemented.");
    }

    delete(mailAddress: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}