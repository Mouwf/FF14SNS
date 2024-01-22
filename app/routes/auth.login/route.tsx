import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { userAuthenticationCookie } from "../../cookies.server";
import { appLoadContext as context } from "../../dependency-injector/get-load-context";

export const meta: MetaFunction = () => {
    return [
        { title: "FF14 SNS ログイン" },
        { name: "description", content: "FF14SNSのログインページです。" },
    ];
}

export const loader = async ({
    request,
}: LoaderFunctionArgs) => {
    // ログインしている場合、トップページにリダイレクトする。
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await userAuthenticationCookie.parse(cookieHeader)) || {};
    if (Object.keys(cookie).length > 0) return redirect("/app");
    return null;
}

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

        // IDトークンとリフレッシュトークンをCookieに保存する。
        const cookie: any = {};
        cookie.idToken = response.idToken;
        cookie.refreshToken = response.refreshToken;
        return redirect("/app", {
            headers: {
                "Set-Cookie": await userAuthenticationCookie.serialize(cookie),
            },
        });
    } catch (error) {
        console.error(error);
        return json({ error: "ログインに失敗しました。" });
    }
}

export default function Login() {
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