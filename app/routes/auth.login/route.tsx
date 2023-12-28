import { ActionFunctionArgs, MetaFunction, redirect } from "@netlify/remix-runtime";
import { Form } from "@remix-run/react";
import FirebaseUserAccountManager from "../../libraries/authentication/firebase-user-account-manager";
import UserAuthenticationAction from "../../actions/authentication/user-authentication-action";
import { userAuthenticationCookie } from "../../cookies.server";

export const meta: MetaFunction = () => {
    return [
        { title: "FF14 SNS ログイン" },
        { name: "description", content: "FF14SNSのログインページです。" },
    ];
}

export const action = async ({
    request,
}: ActionFunctionArgs) => {
    try {
        // ログインする。
        const userAccountManager = new FirebaseUserAccountManager();
        const userAuthenticationAction = new UserAuthenticationAction(userAccountManager);
        const formData = await request.formData();
        const mailAddress = formData.get('mailAddress') as string;
        const password = formData.get('password') as string;
        const response = await userAuthenticationAction.login(mailAddress, password);

        // IDトークンとリフレッシュトークンをCookieに保存する。
        const cookieHeader = request.headers.get("Cookie");
        const cookie = (await userAuthenticationCookie.parse(cookieHeader)) || {};
        cookie.idToken = response.idToken;
        cookie.refreshToken = response.refreshToken;
        return redirect("/app", {
            headers: {
                "Set-Cookie": await userAuthenticationCookie.serialize(cookie),
            },
        });
    } catch (error) {
        console.error(error);
        return redirect("/auth/login", {
            headers: {
                "Set-Cookie": await userAuthenticationCookie.serialize({}),
            },
        });
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