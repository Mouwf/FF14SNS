import Entity from "../common/entity";

/**
 * リリース情報。
 */
export default interface ReleaseInformation extends Entity {
    /**
     * リリースバージョン。
     */
    readonly releaseVersion: string;

    /**
     * リリース名。
     */
    readonly releaseName: string;
}