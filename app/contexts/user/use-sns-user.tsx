import { useContext } from "react";
import { SnsUserContext } from "./sns-user-context";

/**
 * SNSのユーザーを取得する。
 * @returns SNSのユーザー。
 */
export default function useSnsUser() {
    const context = useContext(SnsUserContext);
    if (!context) {
        throw new Error("useUserはSnsUserProviderの子コンポーネントでのみ使用できます。");
    }
    return context;
}