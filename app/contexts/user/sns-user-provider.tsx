import { ReactNode } from "react"
import FF14SnsUser from "../../models/user/ff14-sns-user";
import { SnsUserContext } from "./sns-user-context";

/**
 * SNSのユーザープロバイダー。
 * @param children 子要素。
 * @param snsUser SNSのユーザー。
 * @returns SNSのユーザープロバイダー。
 */
const SnsUserProvider = ({
    children,
    snsUser,
} : {
    children: ReactNode,
    snsUser: FF14SnsUser,
}) => {
    return (
        <SnsUserContext.Provider value={snsUser}>
            { children }
        </SnsUserContext.Provider>
    )
}
export default SnsUserProvider;