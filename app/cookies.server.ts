import { createCookie } from "@remix-run/node";

/**
 * 新規投稿した投稿のIDを保持するCookie。
 */
export const newlyPostedPostCookie = createCookie("newly-posted-post", {
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 3_600,
});