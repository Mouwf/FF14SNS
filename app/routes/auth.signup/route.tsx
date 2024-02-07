import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { commitSession, getSession } from "../../sessions";
import { appLoadContext as context } from "../../dependency-injector/get-load-context";

/**
 * サインアップページのメタ情報を設定する。
 * @returns サインインページのメタ情報。
 */
export const meta: MetaFunction = () => {
    return [
        { title: "FF14 SNS サインアップ" },
        { name: "description", content: "FF14SNSのサインアップページです。" },
    ];
}

/**
 * サインアップページのローダー。
 * @param request リクエスト。
 * @param context コンテキスト。
 * @returns ログインしている場合、トップページにリダイレクトする。
 */
export const loader = async ({
    request,
}: LoaderFunctionArgs) => {
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
}

/**
 * サインアップページのアクション。
 * @param request リクエスト。
 * @param context コンテキスト。
 * @returns ユーザー登録ページにリダイレクトする。
 */
export const action = async ({
    request,
}: ActionFunctionArgs) => {
    try {
        // フォームデータを取得する。
        const formData = await request.formData();
        const mailAddress = formData.get("mailAddress") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        // パスワードとパスワード再確認が一致しない場合、エラーを返す。
        if (password !== confirmPassword) return json({ error: "パスワードが一致しません。" });

        // ユーザーを登録する。
        const userRegistrationAction = context.userRegistrationAction;
        const response = await userRegistrationAction.register(mailAddress, password);

        // IDトークンとリフレッシュトークンをセッションに保存する。
        const idToken = response.idToken;
        const refreshToken = response.refreshToken;
        const cookieHeader = request.headers.get("Cookie");
        const session = await getSession(cookieHeader);
        session.set("idToken", idToken);
        session.set("refreshToken", refreshToken);

        // ユーザー登録ページにリダイレクトする。
        return redirect("/auth/register-user", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    } catch (error) {
        console.error(error);
        return json({ error: "サインアップに失敗しました。" });
    }
}

/**
 * サインアップページ。
 * @returns サインアップページ。
 */
export default function Signup() {
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
            <label>
                <span>パスワード再確認</span>
                <input type="password" name="confirmPassword" />
            </label>
            <button type="submit">サインアップ</button>
        </Form>
    );
}