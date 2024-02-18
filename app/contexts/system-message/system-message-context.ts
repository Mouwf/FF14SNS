import { createContext } from "react";

/**
 * システムメッセージコンテキスト。
 */
const SystemMessageContext = createContext({
    showSystemMessage: (status: "success" | "error", message: string) => {}
});
export default SystemMessageContext;