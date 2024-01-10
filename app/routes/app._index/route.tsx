import { LoaderFunctionArgs, json } from "@netlify/remix-runtime";
import PostEntry from "./components/post-entry";
import LatestPostTimeLine from "./components/latest-post-time-line";
import { newlyPostedPostCookie } from "../../cookies.server";
import { useLoaderData } from "@remix-run/react";
import PostContent from "../../models/post/post-content";

/**
 * 最新の投稿を取得するローダー。
 * ユーザーが投稿した直後の場合、ユーザーの投稿が最初に含まれる投稿を返す。
 * @param request リクエスト。
 * @param context コンテキスト。
 * @returns 最新の投稿。
 */
export const loader = async ({
    request,
    context,
}: LoaderFunctionArgs) => {
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await newlyPostedPostCookie.parse(cookieHeader)) || {};
    const postContents: PostContent[] = await context.latestPostsLoader.getLatestPosts("0");
    if (Object.keys(cookie).length > 0 && cookie.isPosted) {
        return json(postContents);
    }
    return json(postContents);
}

/**
 * トップページのインデックス。
 * @returns トップページのインデックス。
 */
export default function TopIndex() {
    const latestPostContents: PostContent[] = useLoaderData<typeof loader>().map((postContent) => ({
        ...postContent,
        createdAt: new Date(postContent.createdAt),
    }));

    return (
        <div>
            <PostEntry />
            <LatestPostTimeLine postContents={latestPostContents} />
        </div>
    );
}