import systemMessages from "../../messages/system-messages";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import PostEntry from "./components/post-entry";
import LatestPostTimeLine from "./components/latest-post-time-line";
import { getSession } from "../../sessions";
import { newlyPostedPostCookie } from "../../cookies.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
import PostContent from "../../models/post/post-content";
import InfiniteScroll from "../components/infinite-scroll";
import { useContext, useEffect, useState } from "react";
import { appLoadContext as context } from "../../dependency-injector/get-load-context";
import SystemMessageContext from "../../contexts/system-message/system-message-context";
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
    try {
        // プロフィールIDを取得する。
        const cookieHeader = request.headers.get("Cookie");
        const session = await getSession(cookieHeader);
        const profileId = session.get("userId") as string;

        // ユーザーが投稿した直後の場合、ユーザーの投稿が最初に含まれる投稿を返す。
        const cookie = (await newlyPostedPostCookie.parse(cookieHeader)) || {};
        if (cookie.postId) {
            const latestPostsLoader = context.latestPostsLoader;
            const postContents: PostContent[] = await latestPostsLoader.getLatestPosts(profileId);
            return json(postContents, {
                headers: {
                    "Set-Cookie": await newlyPostedPostCookie.serialize({}),
                },
            });
        }

        // 最新の投稿を取得する。
        const latestPostsLoader = context.latestPostsLoader;
        const postContents: PostContent[] = await latestPostsLoader.getLatestPosts(profileId);
        return json(postContents);
    } catch (error) {
        console.error(error);
        if (error instanceof TypeError || error instanceof Error) return json({ errorMessage: error.message });
        return json({ errorMessage: systemMessages.error.unknownError });
    }
}

/**
 * トップページのインデックス。
 * @returns トップページのインデックス。
 */
export default function TopIndex() {
    // システムメッセージを取得する。
    const loaderData = useLoaderData<typeof loader>();
    const loaderErrorMessage = "errorMessage" in loaderData ? loaderData.errorMessage : "";

    // システムメッセージを表示する。
    const { showSystemMessage } = useContext(SystemMessageContext);
    useEffect(() => {
        showSystemMessage("error", loaderErrorMessage);
    }, [loaderData]);

    // 最新の投稿を取得する。
    const fetcher = useFetcher<typeof loader>();
    const initialLatestPostContents: PostContent[] = "errorMessage" in loaderData ? [] : loaderData.map((postContent) => ({
        ...postContent,
        createdAt: new Date(postContent.createdAt),
    }));
    const [latestPostContents, setLatestPostContents] = useState<PostContent[]>(initialLatestPostContents);

    return (
        <div className={styles["main-contents"]}>
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