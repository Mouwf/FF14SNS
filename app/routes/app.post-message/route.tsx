import { ActionFunctionArgs, MetaFunction, redirect } from "@netlify/remix-runtime";
import { Form } from "@remix-run/react";
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
    const releaseVersion = formData.get("releaseVersion");
    const tag = formData.get("tag");
    const content = formData.get("content");

    // 投稿を保存する。
    const cookie = {
        releaseVersion: releaseVersion,
        tag: tag,
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
    const releaseVersions = [
        "パッチ5",
        "パッチ4",
        "パッチ3",
        "パッチ2",
        "パッチ1",
    ];
    const getReleaseVersionOptions = () => {
        return <select name="releaseVersion">
            {releaseVersions.map((releaseVersion, index) => {
                return <option key={index} value={releaseVersion}>{releaseVersion}</option>;
            })}
        </select>;
    }

    const tags = [
        "タグ1",
        "タグ2",
        "タグ3",
        "タグ4",
    ];
    const getTagOptions = () => {
        return <select name="tag">
            {tags.map((tag, index) => {
                return <option key={index} value={tag}>{tag}</option>;
            })}
        </select>;
    }

    return (
        <Form method="post">
            <div>
                {getReleaseVersionOptions()}
                {getTagOptions()}
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