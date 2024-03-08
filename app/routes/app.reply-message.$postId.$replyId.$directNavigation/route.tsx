import systemMessages from "../../messages/system-messages";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useContext, useEffect } from "react";
import { appLoadContext as context } from "../../dependency-injector/get-load-context";
import SystemMessageContext from "../../contexts/system-message/system-message-context";
import { useActionData, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import PostDisplay from "../components/post-display/post-display";
import PostForm from "../components/post-form/post-form";
import ErrorDisplay from "../components/error-display";
import { getSession } from "../../sessions";

/**
 * 投稿を取得するローダー。
 * @param params パラメータ。
 * @returns 投稿。
 */
export const loader = async ({
    params,
}: LoaderFunctionArgs) => {
    try {
        const replyId = Number(params.replyId);
        const replyLoader = context.replyLoader;
        const reply = await replyLoader.getReplyById(replyId);
        return json(reply);
    }  catch (error) {
        console.error(error);
        if (error instanceof TypeError || error instanceof Error) return json({ errorMessage: error.message });
        return json({ errorMessage: systemMessages.error.unknownError });
    }
}

/**
 * リプライを行うアクション。
 * @param request リクエスト。
 * @returns 成功メッセージ。
 */
export const action = async ({
    request,
    params,
}: ActionFunctionArgs) => {
    try {
        // 認証済みユーザーを取得する。
        const cookieHeader = request.headers.get("Cookie");
        const session = await getSession(cookieHeader);
        const profileId = session.get("userId") as string;
        const authenticatedUserLoader = context.authenticatedUserLoader;
        const authenticatedUser = await authenticatedUserLoader.getUserByProfileId(profileId);

        // ユーザーIDを取得する。
        const userId = authenticatedUser.id;

        // 投稿IDを取得する。
        const postId = Number(params.postId);
        const replyId = Number(params.replyId);

        // フォームデータを取得する。
        const formData = await request.formData();
        const content = formData.get("content") as string;

        // メッセージを投稿する。
        const replyMessageAction = context.replyMessageAction;
        await replyMessageAction.reply(userId, postId, replyId, content);

        // 成功メッセージを返す。
        return json({ successMessage: systemMessages.success.replyMessagePosted });
    } catch (error) {
        console.error(error);
        if (error instanceof TypeError || error instanceof Error) return json({ errorMessage: error.message });
        return json({ errorMessage: systemMessages.error.unknownError });
    }
}

/**
 * 投稿にリプライページ。
 * @returns 投稿にリプライページ。
 */
export default function ReplyMessage() {
    // システムメッセージを取得する。
    const loaderData = useLoaderData<typeof loader>();
    const loaderErrorMessage = "errorMessage" in loaderData ? loaderData.errorMessage : "";
    const actionData = useActionData<typeof action>();
    const actionSuccessMessage = actionData && "successMessage" in actionData ? actionData.successMessage : "";
    const actionErrorMessage = actionData && "errorMessage" in actionData ? actionData.errorMessage : "";

    // システムメッセージを表示する。
    const { showSystemMessage } = useContext(SystemMessageContext);
    useEffect(() => {
        showSystemMessage("error", loaderErrorMessage);
    }, [loaderData]);
    useEffect(() => {
        showSystemMessage("error", actionErrorMessage);
    }, [actionData]);

    // リプライに成功した場合、投稿詳細ページにリダイレクトする。
    const params = useParams();
    const postId = params.postId;
    const isDirectNavigation = params.directNavigation === "direct";
    const navigate = useNavigate();
    useEffect(() => {
        if (!actionSuccessMessage) return;
        if (isDirectNavigation) {
            navigate(`/app/post-detail/${postId}`, {
                replace: true,
            });
        } else {
            navigate(-1);
        }
    }, [actionData]);

    // リプライを取得する。
    const reply = "errorMessage" in loaderData ? null : {
        ...loaderData,
        createdAt: new Date(loaderData.createdAt)
    };

    // ローダーでエラーが発生した場合、エラーメッセージを表示するコンポーネントを表示する。
    if (!reply) {
        return (
            <ErrorDisplay errorMessage={loaderErrorMessage} />
        );
    }

    return (
        <div>
            <PostDisplay postContent={reply} isDirectNavigation={false} hasDetailAddress={false} hasInteraction={false} />
            <PostForm submitMessage="返信" />
        </div>
    );
}