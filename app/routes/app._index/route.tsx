import { LoaderFunctionArgs, json } from "@remix-run/node";
import PostEntry from "./components/post-entry";
import LatestPostTimeLine from "./components/latest-post-time-line";
import { newlyPostedPostCookie } from "../../cookies.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import PostContent from "../../models/post/post-content";
import InfiniteScroll from "../components/infinite-scroll";
import { useState } from "react";
import { appLoadContext as context } from "../../dependency-injector/get-load-context";
import styles from "./route.module.css";

/**
 * 最新の投稿を取得するローダー。
 * ユーザーが投稿した直後の場合、ユーザーの投稿が最初に含まれる投稿を返す。
 * @param request リクエスト。
 * @param context コンテキスト。
 * @returns 最新の投稿。
 */
export const loader = async ({
    request,
}: LoaderFunctionArgs) => {
    // 新規投稿した投稿のIDを保持するCookieを取得する。
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await newlyPostedPostCookie.parse(cookieHeader)) || {};

    // ユーザーが投稿した直後の場合、ユーザーの投稿が最初に含まれる投稿を返す。
    if (cookie.postId) {
        const latestPostsLoader = context.latestPostsLoader;
        const postContents: PostContent[] = await latestPostsLoader.getLatestPosts();
        return json(postContents, {
            headers: {
                "Set-Cookie": await newlyPostedPostCookie.serialize({}),
            },
        });
    }

    // 最新の投稿を取得する。
    const latestPostsLoader = context.latestPostsLoader;
    const postContents: PostContent[] = await latestPostsLoader.getLatestPosts();
    return json(postContents);
}

/**
 * トップページのインデックス。
 * @returns トップページのインデックス。
 */
export default function TopIndex() {
    const fetcher = useFetcher<typeof loader>();
    const initialLatestPostContents: PostContent[] = useLoaderData<typeof loader>().map((postContent) => ({
        ...postContent,
        createdAt: new Date(postContent.createdAt),
    }));
    const [latestPostContents, setLatestPostContents] = useState<PostContent[]>(initialLatestPostContents);

    return (
        <div className={styles["test-class"]}>
            <InfiniteScroll
                fetcher={fetcher}
                targetAddress="/app/latest-posts"
                contents={latestPostContents}
                setContents={setLatestPostContents}
            >
                <PostEntry />
                <LatestPostTimeLine postContents={latestPostContents} />
            </InfiniteScroll>
        </div>
    );
}