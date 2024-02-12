import systemMessages from "../../messages/system-messages";
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "../../sessions";
import { appLoadContext as context } from "../../dependency-injector/get-load-context";

/**
 * ログインページのメタ情報を設定する。
 * @returns ログインページのメタ情報。
 */
export const meta: MetaFunction = () => {
    return [
        { title: "FF14 SNS ログイン" },
        { name: "description", content: "FF14SNSのログインページです。" },
    ];
}

/**
 * ログインページのローダー。
 * @param request リクエスト。
 * @param context コンテキスト。
 * @returns ログインしている場合、トップページにリダイレクトする。
 */
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
        return null;
    } catch (error) {
        console.error(error);
        if (error instanceof TypeError || error instanceof Error) return json({ errorMessage: error.message });
        return json({ errorMessage: systemMessages.error.unknownError });
    }
}

/**
 * ログインページのアクション。
 * @param request リクエスト。
 * @param context コンテキスト。
 * @returns トップページにリダイレクトする。
 * 認証済みユーザーが存在しない場合、ユーザー登録ページにリダイレクトする。
 */
export const action = async ({
    request,
}: ActionFunctionArgs) => {
    try {
        // フォームデータを取得する。
        const formData = await request.formData();
        const mailAddress = formData.get("mailAddress") as string;
        const password = formData.get("password") as string;

        // ログインする。
        const userAuthenticationAction = context.userAuthenticationAction;
        const response = await userAuthenticationAction.login(mailAddress, password);

        // IDトークンとリフレッシュトークンをセッションに保存する。
        const idToken = response.idToken;
        const refreshToken = response.refreshToken;
        const cookieHeader = request.headers.get("Cookie");
        const session = await getSession(cookieHeader);
        session.set("idToken", idToken);
        session.set("refreshToken", refreshToken);

        // 認証済みユーザーを取得する。
        const authenticatedUserLoader = context.authenticatedUserLoader;
        const authenticatedUser = await authenticatedUserLoader.getUserByToken(idToken);

        // 認証済みユーザーが存在しない場合、ユーザー登録ページにリダイレクトする。
        if (!authenticatedUser) {
            return redirect("/auth/register-user", {
                headers: {
                    "Set-Cookie": await commitSession(session),
                },
            });
        }

        // ユーザーIDをセッションに保存する。
        session.set("userId", authenticatedUser.profileId);

        // トップページにリダイレクトする。
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
 * ログインページ。
 * @returns ログインページ。
 */
export default function Login() {
    // エラーメッセージを取得する。
    const loaderData = useLoaderData<typeof loader>();
    const loaderErrorMessage = loaderData && "errorMessage" in loaderData ? loaderData.errorMessage : "";
    const actionData = useActionData<typeof action>();
    const actionErrorMessage = actionData ? actionData.errorMessage : "";

    return (
        <Form method="post">
            <label>
                <span>メールアドレス</span>
                <input type="email" name="mailAddress" />
            </label>
            <label>
                <span>パスワード</span>
                <input type="password" name="password" />
            </label>
            <button type="submit">ログイン</button>
        </Form>
    );
}