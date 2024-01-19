import { createContext } from "react";
import SnsUser from "../../models/user/sns-user";

/**
 * SNSのユーザーコンテキスト。
 */
export const SnsUserContext = createContext<SnsUser | null>(null);