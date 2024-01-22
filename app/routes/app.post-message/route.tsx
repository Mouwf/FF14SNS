import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { userAuthenticationCookie, newlyPostedPostCookie } from "../../cookies.server";
import useSnsUser from "../../contexts/user/use-sns-user";
import { appLoadContext as context } from "../../dependency-injector/get-load-context";

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
}: ActionFunctionArgs) => {
    try {
        // ユーザー認証用のCookieを取得する。
        const cookieHeader = request.headers.get("Cookie");
        const cookieUserAuthentication = (await userAuthenticationCookie.parse(cookieHeader));

        // 認証済みユーザーを取得する。
        const formData = await request.formData();
        const profileId = formData.get("userId") as string;
        const authenticatedUserLoader = context.authenticatedUserLoader;
        const authenticatedUser = await authenticatedUserLoader.getUserByProfileId(profileId);

        // 認証済みユーザーが存在しない場合、エラーを返す。
        if (!authenticatedUser) return json({ error: "ユーザーが存在しません。" });

        // ユーザーIDを取得する。
        const userId = authenticatedUser.id;

        // フォームデータを取得する。
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
        return json({ error: "メッセージの投稿に失敗しました。" });
    }
}

/**
 * メッセージ投稿ページ。
 * @returns メッセージ投稿ページ。
 */
export default function PostMessage() {
    const snsUser = useSnsUser();

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
            <input type="hidden" name="userId" value={snsUser.userId} />
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