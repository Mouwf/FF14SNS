import { createContext } from "react";
import FF14SnsUser from "../../models/user/ff14-sns-user";

/**
 * SNSのユーザーコンテキスト。
 */
export const SnsUserContext = createContext<FF14SnsUser | null>(null);