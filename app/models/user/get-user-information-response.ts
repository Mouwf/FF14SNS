import UserInformation from "./user-information";

/**
 * ユーザー情報取得のレスポンス。
 */
export default interface GetUserInformationResponse {
    /**
     * ユーザー情報。
     */
    users: UserInformation[];
}