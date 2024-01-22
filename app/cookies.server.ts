import { createCookie } from "@remix-run/node";

/**
 * ユーザー認証用のCookie。
 */
export const userAuthenticationCookie = createCookie("user-authentication", {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 2_592_000,
});

/**
 * 新規投稿した投稿のIDを保持するCookie。
 */
export const newlyPostedPostCookie = createCookie("newly-posted-post", {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 3_600,
});