import { LoaderFunctionArgs, json } from "@remix-run/node";
import PostContent from "../../models/post/post-content";
import { appLoadContext as context } from "../../dependency-injector/get-load-context";

/**
 * 最新の投稿を取得するローダー。
 * ユーザーが投稿した直後の場合、ユーザーの投稿が最初に含まれる投稿を返す。
 * @param context コンテキスト。
 * @param params パラメーター。
 * @returns 最新の投稿。
 */
export const loader = async ({
    params,
}: LoaderFunctionArgs) => {
    if (params.id === undefined || !params.id) return json([]);
    const postId = params.id;
    const postContents: PostContent[] = await context.latestPostsLoader.getLatestPosts(postId);
    return json(postContents);
}