import { createCookie } from "@netlify/remix-runtime";

/**
 * ユーザー認証用のCookie。
 */
export const userAuthenticationCookie = createCookie("user-authentication", {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 2_592_000,
});