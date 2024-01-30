import { createCookieSessionStorage } from "@remix-run/node";

if (!process.env.SESSION_SERCRET_KEY) {
    throw new Error("SESSION_SERCRET_KEYが設定されていません。");
}

/**
 * セッションに保存するデータ。
 */
type SessionData = {
    /**
     * IDトークン。
     */
    idToken: string;

    /**
     * リフレッシュトークン。
     */
    refreshToken: string;

    /**
     * ユーザーID。
     */
    userId: string;
}

const {
    getSession,
    commitSession,
    destroySession,
} = createCookieSessionStorage<SessionData>({
    cookie: {
        name: "__session",
        path: "/",
        secrets: [process.env.SESSION_SERCRET_KEY],
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 2_592_000,
    },
});
export {
    getSession,
    commitSession,
    destroySession,
};