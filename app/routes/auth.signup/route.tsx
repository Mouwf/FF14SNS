import systemMessages from "../../messages/system-messages";
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "../../sessions";
import { appLoadContext as context } from "../../dependency-injector/get-load-context";
import { useContext, useEffect } from "react";
import SystemMessageContext from "../../contexts/system-message/system-message-context";

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

        // バリデーションを行う。
        const userRegistrationAction = context.userRegistrationAction;
        const inputErrors = userRegistrationAction.validateRegistrationUser(mailAddress, password, confirmPassword);
        if (inputErrors) return json(inputErrors);

        // ユーザーを登録する。
        const response = await userRegistrationAction.register(mailAddress, password, confirmPassword);

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
        if (error instanceof TypeError || error instanceof Error) return json({ errorMessage: error.message });
        return json({ errorMessage: systemMessages.error.unknownError });
    }
}

/**
 * サインアップページ。
 * @returns サインアップページ。
 */
export default function Signup() {
    // システムメッセージを取得する。
    const loaderData = useLoaderData<typeof loader>();
    const loaderErrorMessage = loaderData && "errorMessage" in loaderData ? loaderData.errorMessage : "";
    const actionData = useActionData<typeof action>();
    const actionErrorMessage = actionData && "errorMessage" in actionData ? actionData.errorMessage : "";

    // システムメッセージを表示する。
    const { showSystemMessage } = useContext(SystemMessageContext);
    useEffect(() => {
        showSystemMessage("error", loaderErrorMessage);
    }, [loaderData]);
    useEffect(() => {
        showSystemMessage("error", actionErrorMessage);
    }, [actionData]);

    // バリデーションエラーを取得する。
    const inputErrors = actionData && "mailAddress" in actionData ? actionData : null;

    return (
        <Form method="post">
            {inputErrors && inputErrors.mailAddress.length > 0 && 
                <ul>
                    {inputErrors.mailAddress.map((errorMessage, index) => (
                        <li key={index}>{errorMessage}</li>
                    ))}
                </ul>
            }
            <label>
                <span>メールアドレス</span>
                <input type="email" name="mailAddress" />
            </label>
            {inputErrors && inputErrors.password.length > 0 && 
                <ul>
                    {inputErrors.password.map((errorMessage, index) => (
                        <li key={index}>{errorMessage}</li>
                    ))}
                </ul>
            }
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