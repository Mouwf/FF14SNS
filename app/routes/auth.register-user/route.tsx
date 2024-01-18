import { ActionFunctionArgs, json, redirect } from "@netlify/remix-runtime";
import { Form } from "@remix-run/react";
import { userAuthenticationCookie } from "../../cookies.server";

/**
 * SNSのユーザー登録を行うアクション。
 * @param request リクエスト。
 * @param context コンテキスト。
 * @returns トップページにリダイレクトする。
 */
export const action = async ({
    request,
    context,
}: ActionFunctionArgs) => {
    try {
        // ログインしていない場合、ログインページにリダイレクトする。
        const cookieHeader = request.headers.get("Cookie");
        const cookie = (await userAuthenticationCookie.parse(cookieHeader)) || {};
        if (Object.keys(cookie).length <= 0) return redirect("/auth/login", {
            headers: {
                "Set-Cookie": await userAuthenticationCookie.serialize({}),
            },
        });

        // フォームデータを取得する。
        const formData = await request.formData();
        const userName = formData.get("userName") as string;

        // 認証プロバイダーIDを取得する。
        const authenticatedUserLoader = context.authenticatedUserLoader;
        const authenticationProviderId = await authenticatedUserLoader.getAuthenticationProviderId(cookie.idToken);

        // ユーザーを登録する。
        await context.snsUserRegistrationAction.register(authenticationProviderId, userName);
        return redirect("/app");
    } catch (error) {
        console.error(error);
        return json({ error: "ユーザー登録に失敗しました。" });
    }
}

/**
 * ユーザー登録ページ。
 * @returns ユーザー登録ページ。
 */
export default function RegisterUser() {
    return (
        <Form method="post">
            <label htmlFor="userName">FF14のユーザー名(user_name@world)</label>
            <input type="text" name="userName" />
            <button type="submit">登録</button>
        </Form>
    );
}