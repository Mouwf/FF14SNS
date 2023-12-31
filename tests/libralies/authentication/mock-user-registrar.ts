import IUserRegistrar from "../../../app/libraries/authentication/i-user-registrar";

export default class MockUserRegistrar implements IUserRegistrar {
    register(mailAddress: string, password: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    delete(mailAddress: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
}