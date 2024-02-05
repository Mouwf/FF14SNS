import { LoaderFunctionArgs, json } from "@remix-run/node";
import PostContent from "../../models/post/post-content";
import { appLoadContext as context } from "../../dependency-injector/get-load-context";
import { getSession } from "../../sessions";

/**
 * 最新の投稿を取得するローダー。
 * ユーザーが投稿した直後の場合、ユーザーの投稿が最初に含まれる投稿を返す。
 * @param request リクエスト。
 * @param context コンテキスト。
 * @param params パラメーター。
 * @returns 最新の投稿。
 */
export const loader = async ({
    request,
    params,
}: LoaderFunctionArgs) => {
    if (params.id === undefined || !params.id) return json([]);
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const profileId = session.get("userId") as string;
    const postContents: PostContent[] = await context.latestPostsLoader.getLatestPosts(profileId);
    return json(postContents);
}