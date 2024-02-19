import systemMessages from "../../messages/system-messages";
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { getSession } from "../../sessions";
import { newlyPostedPostCookie } from "../../cookies.server";
import { appLoadContext as context } from "../../dependency-injector/get-load-context";
import styles from "./route.module.css";
import { useContext, useEffect } from "react";
import SystemMessageContext from "../../contexts/system-message/system-message-context";

/**
 * メッセージ投稿ページのメタ情報を設定する。
 * @returns メッセージ投稿ページのメタ情報。
 */
export const meta: MetaFunction = () => {
    return [
        { title: "メッセージを投稿する" },
        { name: "description", content: "FF14SNSのメッセージ投稿ページです。" },
    ];
}

/**
 * リリース情報を取得するローダー。
 * @param request リクエスト。
 * @param context コンテキスト。
 */
export const loader = async ({
    request,
}: LoaderFunctionArgs) => {
    try {
        const cookieHeader = request.headers.get("Cookie");
        const session = await getSession(cookieHeader);
        const profileId = session.get("userId") as string;
        const releaseInformationLoader = context.releaseInformationLoader;
        const allReleaseInformation = await releaseInformationLoader.getReleaseInformationBelowUserSetting(profileId);
        return json(allReleaseInformation);
    } catch (error) {
        console.error(error);
        if (error instanceof TypeError || error instanceof Error) return json({ errorMessage: error.message });
        return json({ errorMessage: systemMessages.error.unknownError });
    }
}

/**
 * メッセージを投稿するアクション。
 * @param request リクエスト。
 * @param context コンテキスト。
 * @returns メッセージを投稿するアクション。
 */
export const action = async ({
    request,
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

        // フォームデータを取得する。
        const formData = await request.formData();
        const releaseInformationId = Number(formData.get("releaseInformationId"));
        const content = formData.get("content") as string;

        // メッセージを投稿する。
        const postMessageAction = context.postMessageAction;
        const postId = await postMessageAction.post(userId, releaseInformationId, content);

        // 投稿を保存する。
        const cookieNewlyPostedPost = {
            postId: postId,
        };
        return redirect("/app", {
            headers: {
                "Set-Cookie": await newlyPostedPostCookie.serialize(cookieNewlyPostedPost),
            },
        });
    } catch (error) {
        console.error(error);
        if (error instanceof TypeError || error instanceof Error) return json({ errorMessage: error.message });
        return json({ errorMessage: systemMessages.error.unknownError });
    }
}

/**
 * メッセージ投稿ページ。
 * @returns メッセージ投稿ページ。
 */
export default function PostMessage() {
    // システムメッセージを取得する。
    const loaderData = useLoaderData<typeof loader>();
    const loaderErrorMessage = "errorMessage" in loaderData ? loaderData.errorMessage : "";
    const actionData = useActionData<typeof action>();
    const actionErrorMessage = actionData ? actionData.errorMessage : "";

    // システムメッセージを表示する。
    const { showSystemMessage } = useContext(SystemMessageContext);
    useEffect(() => {
        showSystemMessage("error", loaderErrorMessage);
    }, [loaderData]);
    useEffect(() => {
        showSystemMessage("error", actionErrorMessage);
    }, [actionData]);

    // リリース情報を取得する。
    const allReleaseInformation = "errorMessage" in loaderData ? [] : loaderData;
    const getReleaseVersionOptions = () => {
        return <select name="releaseInformationId">
            {allReleaseInformation.map((releaseInformation) => {
                return <option key={releaseInformation.id} value={releaseInformation.id}>{`${releaseInformation.releaseVersion} ${releaseInformation.releaseName}`}</option>;
            })}
        </select>;
    }

    return (
        <div className={styles["post-message-area"]}>
            <Form method="post">
                <div className={styles["post-message"]}>
                    <textarea name="content" placeholder="今日はどんな冒険をしましたか？" />
                </div>
                <div className={styles["post-message-container"]}>
                    <div className={styles["post-release-version"]}>
                        {getReleaseVersionOptions()}
                    </div>
                    <div className={styles["post-message-btn"]}>
                        <button type="submit">投稿</button>
                    </div>
                </div>
            </Form>
        </div>
    );
}