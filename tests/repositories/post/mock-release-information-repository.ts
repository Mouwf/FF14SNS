import ReleaseInformation from "../../../app/models/post/release-information";
import IReleaseInformationRepository from "../../../app/repositories/post/i-release-information-repository";

export default class MockReleaseInformationRepository implements IReleaseInformationRepository {
    get(releaseId: string): Promise<ReleaseInformation> {
        throw new Error("Method not implemented.");
    }

    getAll(): Promise<ReleaseInformation[]> {
        throw new Error("Method not implemented.");
    }
}