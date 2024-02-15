import systemMessages from "../../messages/system-messages";
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { commitSession, destroySession, getSession } from "../../sessions";
import { appLoadContext as context } from "../../dependency-injector/get-load-context";

/**
 * ログインページのメタ情報を設定する。
 * @returns ログインページのメタ情報。
 */
export const meta: MetaFunction = () => {
    return [
        { title: "FF14 SNS ユーザー登録" },
        { name: "description", content: "FF14SNSのユーザー登録ページです。" },
    ];
}

export const loader = async ({
    request,
}: LoaderFunctionArgs) => {
    try {
        // ログインしている場合、トップページにリダイレクトする。
        const cookieHeader = request.headers.get("Cookie");
        const session = await getSession(cookieHeader);
        if (session.has("userId")) {
            return redirect("/app", {
                headers: {
                    "Set-Cookie": await commitSession(session),
                },
            });
        }

        // ログインしていない場合、ログインページにリダイレクトする。
        if (!session.has("idToken")) {
            return redirect("/auth/login", {
                headers: {
                    "Set-Cookie": await destroySession(session),
                },
            });
        }

        // リリース情報を全件取得する。
        const releaseInformationLoader = context.releaseInformationLoader;
        const allReleaseInformation = await releaseInformationLoader.getAllReleaseInformation();
        return json(allReleaseInformation);
    } catch (error) {
        console.error(error);
        if (error instanceof TypeError || error instanceof Error) return json({ errorMessage: error.message });
        return json({ errorMessage: systemMessages.error.unknownError });
    }
}

/**
 * SNSのユーザー登録を行うアクション。
 * @param request リクエスト。
 * @param context コンテキスト。
 * @returns トップページにリダイレクトする。
 */
export const action = async ({
    request,
}: ActionFunctionArgs) => {
    try {
        // フォームデータを取得する。
        const formData = await request.formData();
        const userName = formData.get("userName") as string;
        const currentReleaseInformationId = Number(formData.get("currentReleaseInformationId"));

        // 認証プロバイダーIDを取得する。
        const cookieHeader = request.headers.get("Cookie");
        const session = await getSession(cookieHeader);
        const idToken = session.get("idToken") as string;
        const authenticatedUserLoader = context.authenticatedUserLoader;
        const authenticationProviderId = await authenticatedUserLoader.getAuthenticationProviderId(idToken);

        // ユーザーを登録する。
        await context.snsUserRegistrationAction.register(authenticationProviderId, userName, currentReleaseInformationId);

        // 認証済みユーザーを取得する。
        const authenticatedUser = await authenticatedUserLoader.getUserByToken(idToken);

        // 認証済みユーザーが存在しない場合、ログインページにリダイレクトする。
        if (!authenticatedUser) {
            return redirect("/auth/login", {
                headers: {
                    "Set-Cookie": await destroySession(session),
                },
            });
        }

        // ユーザー登録に成功した場合、トップページにリダイレクトする。
        const userId = authenticatedUser.profileId;
        session.set("userId", userId);
        return redirect("/app", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    } catch (error) {
        console.error(error);
        if (error instanceof TypeError || error instanceof Error) return json({ errorMessage: error.message });
        return json({ errorMessage: systemMessages.error.unknownError });
    }
}

/**
 * ユーザー登録ページ。
 * @returns ユーザー登録ページ。
 */
export default function RegisterUser() {
    // エラーメッセージを取得する。
    const loaderData = useLoaderData<typeof loader>();
    const loaderErrorMessage = "errorMessage" in loaderData ? loaderData.errorMessage : "";
    const actionData = useActionData<typeof action>();
    const actionErrorMessage = actionData ? actionData.errorMessage : "";

    // リリース情報を全件表示する。
    const allReleaseInformation = "errorMessage" in loaderData ? [] : loaderData;
    const getReleaseVersionOptions = () => {
        return <select name="currentReleaseInformationId">
            {allReleaseInformation.map((releaseInformation) => {
                return <option key={releaseInformation.id} value={releaseInformation.id}>{`${releaseInformation.releaseVersion} ${releaseInformation.releaseName}`}</option>;
            })}
        </select>;
    }

    return (
        <Form method="post">
            { /** userNameにメールアドレスが入らないようにしている。 */ }
            <input type="text" style={{ display: "none" }} />
            <label htmlFor="userName">FF14のユーザー名(UserName@world)</label>
            <input type="text" name="userName" autoComplete="off" />
            <label htmlFor="currentReleaseInformationId">現在のパッチ</label>
            {getReleaseVersionOptions()}
            <button type="submit">登録</button>
        </Form>
    );
}