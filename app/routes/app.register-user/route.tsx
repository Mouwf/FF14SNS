import { ActionFunctionArgs, json, redirect } from "@netlify/remix-runtime";
import { Form } from "@remix-run/react";

export const action = async ({
    request,
    context,
}: ActionFunctionArgs) => {
    // フォームデータを取得する。
    const formData = await request.formData();
    const userName = formData.get("userName") as string;

    // ユーザー名がない場合、エラーを返す。
    if (!userName) return json({ error: "ユーザー名が入力されていません。" });

    // ユーザーを登録する。
    context.snsUserRegistrationAction.register(userName);
    return redirect("/app");
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