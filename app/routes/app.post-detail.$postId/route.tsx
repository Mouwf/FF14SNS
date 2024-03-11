import systemMessages from "../../messages/system-messages";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useContext, useEffect, useState } from "react";
import { appLoadContext as context } from "../../dependency-injector/get-load-context";
import SystemMessageContext from "../../contexts/system-message/system-message-context";
import { useLoaderData } from "@remix-run/react";
import PostDisplay from "../components/post-display/post-display";
import ReplyContents from "./components/reply-contents";
import ErrorDisplay from "../components/error-display";

/**
 * 投稿、リプライを取得するローダー。
 * @param params パラメータ。
 * @returns 投稿、リプライ。
 */
export const loader = async ({
    params,
}: LoaderFunctionArgs) => {
    try {
        // 投稿を取得する。
        const postId = Number(params.postId);
        const postLoader = context.postLoader;
        const post = await postLoader.getPostById(postId);

        // リプライを取得する。
        const repliesLoader = context.repliesLoader;
        const replies = await repliesLoader.getAllRepliesByPostId(postId);

        // 投稿、リプライを返す。
        return json({ post, replies });
    }  catch (error) {
        console.error(error);
        if (error instanceof TypeError || error instanceof Error) return json({ errorMessage: error.message });
        return json({ errorMessage: systemMessages.error.unknownError });
    }
}

/**
 * 投稿詳細ページ。
 * @returns 投稿詳細ページ。
 */
export default function PostDetail() {
    // システムメッセージを取得する。
    const loaderData = useLoaderData<typeof loader>();
    const loaderErrorMessage = "errorMessage" in loaderData ? loaderData.errorMessage : "";

    // システムメッセージを表示する。
    const { showSystemMessage } = useContext(SystemMessageContext);
    useEffect(() => {
        showSystemMessage("error", loaderErrorMessage);
    }, [loaderData]);

    // 投稿、リプライを取得する。
    const post = "post" in loaderData ? {
        ...loaderData.post,
        createdAt: new Date(loaderData.post.createdAt)
    } : null;
    const replies = "replies" in loaderData ? loaderData.replies.map((replyContent) => ({
        ...replyContent,
        createdAt: new Date(replyContent.createdAt),
    })) : [];

    // ローダーでエラーが発生した場合、エラーメッセージを表示するコンポーネントを表示する。
    if (!post) {
        return (
            <ErrorDisplay errorMessage={loaderErrorMessage} />
        );
    }

    return (
        <div>
            <PostDisplay postContent={post} isDirectNavigation={false} hasDetailAddress={false} hasInteraction={true} />
            <ReplyContents replyContents={replies} />
        </div>
    );
}