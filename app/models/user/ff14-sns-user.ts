import Entity from "../common/entity";

/**
 * FF14SNSのユーザー。
 */
export default interface FF14SnsUser extends Entity {
    /**
     * ユーザー名。
     */
    readonly userName: string;
}