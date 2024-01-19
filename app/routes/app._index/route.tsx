import { LoaderFunctionArgs, json } from "@netlify/remix-runtime";
import PostEntry from "./components/post-entry";
import LatestPostTimeLine from "./components/latest-post-time-line";
import { newlyPostedPostCookie } from "../../cookies.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import PostContent from "../../models/post/post-content";
import InfiniteScroll from "../components/infinite-scroll";
import { useState } from "react";

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
    if (cookie.isPosted) {
        const userPostContent: PostContent = {
            id: 100,
            createdAt: new Date(),
            releaseVersion: cookie.releaseVersion,
            tag: cookie.tag,
            content: cookie.content,
        };
        postContents.unshift(userPostContent);
        return json(postContents);
    }
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
        <div>
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