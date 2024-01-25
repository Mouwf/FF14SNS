import { ReactNode } from "react"
import SnsUser from "../../models/user/sns-user";
import { SnsUserContext } from "./sns-user-context";

/**
 * SNSのユーザープロバイダー。
 * @param children 子要素。
 * @param snsUser SNSユーザー情報。
 * @returns SNSのユーザープロバイダー。
 */
const SnsUserProvider = ({
    children,
    snsUser,
} : {
    children: ReactNode,
    snsUser: SnsUser,
}) => {
    return (
        <SnsUserContext.Provider value={snsUser}>
            { children }
        </SnsUserContext.Provider>
    )
}
export default SnsUserProvider;