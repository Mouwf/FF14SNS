import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from "@netlify/remix-runtime";
import { Form, useLoaderData } from "@remix-run/react";
import { newlyPostedPostCookie } from "../../cookies.server";

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
    context,
}: LoaderFunctionArgs) => {
    const releaseInformationLoader = context.releaseInformationLoader;
    const allReleaseInformation = await releaseInformationLoader.getAllReleaseInformation();
    return json(allReleaseInformation);
}

/**
 * メッセージを投稿するアクション。
 * @param request リクエスト。
 * @param context コンテキスト。
 * @returns メッセージを投稿するアクション。
 */
export const action = async ({
    request,
    context,
}: ActionFunctionArgs) => {
    // フォームデータを取得する。
    const formData = await request.formData();
    const releaseInformation = formData.get("releaseInformationId");
    const content = formData.get("content");

    // 投稿を保存する。
    const cookie = {
        releaseVersion: releaseInformation,
        content: content,
        isPosted: true,
    };
    return redirect("/app", {
        headers: {
            "Set-Cookie": await newlyPostedPostCookie.serialize(cookie),
        },
    });
}

/**
 * メッセージ投稿ページ。
 * @returns メッセージ投稿ページ。
 */
export default function PostMessage() {
    const allReleaseInformation = useLoaderData<typeof loader>();
    const getReleaseVersionOptions = () => {
        return <select name="releaseInformationId">
            {allReleaseInformation.map((releaseInformation) => {
                return <option key={releaseInformation.id} value={releaseInformation.id}>{`${releaseInformation.releaseVersion} ${releaseInformation.releaseName}`}</option>;
            })}
        </select>;
    }

    return (
        <Form method="post">
            <div>
                {getReleaseVersionOptions()}
            </div>
            <div>
                <textarea name="content" placeholder="メッセージを入力してください" />
            </div>
            <div>
                <button type="submit">投稿</button>
            </div>
        </Form>
    );
}