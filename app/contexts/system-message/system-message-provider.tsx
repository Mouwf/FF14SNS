import SystemMessageContext from "./system-message-context";
import { ReactNode } from "react";
import toast, { Toaster, useToaster } from "react-hot-toast";

/**
 * システムメッセージプロバイダー。
 * @param children 子要素。
 * @returns システムメッセージプロバイダー。
 */
const SystemMessageProvider = ({
    children,
}: {
    children: ReactNode,
}) => {
    const showSystemMessage = (status: "success" | "error", message: string) => {
        if (!message) return;
        switch (status) {
            case "success":
            toast.success(message);
            break;
            case "error":
            toast.error(message);
            break;
        }
    };

    return (
        <SystemMessageContext.Provider value={{ showSystemMessage }}>
            {children}
            <Toaster
                position="bottom-right"
                toastOptions={{
                    className: "",
                    style: {
                    background: "#363636",
                    color: "#fff",
                    },
                    success: {
                    duration: 3000,
                    },
                    error: {
                    duration: 4000,
                    },
                }}
            />
        </SystemMessageContext.Provider>
    );
};
export default SystemMessageProvider;