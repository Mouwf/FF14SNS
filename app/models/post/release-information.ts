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
     * リリース日時。
     */
    readonly releaseName: string;
}