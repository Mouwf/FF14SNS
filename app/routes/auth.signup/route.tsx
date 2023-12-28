import { ActionFunctionArgs, MetaFunction, redirect } from "@netlify/remix-runtime";
import { Form } from "@remix-run/react";
import FirebaseUserAccountManager from "../../libraries/authentication/firebase-user-account-manager";
import UserRegistrationAction from "../../actions/authentication/user-registration-action";
import { userAuthenticationCookie } from "../../cookies.server";

export const meta: MetaFunction = () => {
    return [
        { title: "FF14 SNS サインイン" },
        { name: "description", content: "FF14SNSのサインインページです。" },
    ];
}

export const action = async ({
    request,
}: ActionFunctionArgs) => {
    try {
        // ユーザーを登録する。
        const userAccountManager = new FirebaseUserAccountManager();
        const userAuthenticationAction = new UserRegistrationAction(userAccountManager);
        const formData = await request.formData();
        const mailAddress = formData.get('mailAddress') as string;
        const password = formData.get('password') as string;
        const response = await userAuthenticationAction.register(mailAddress, password);

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
        return redirect("/auth/signup", {
            headers: {
                "Set-Cookie": await userAuthenticationCookie.serialize({}),
            },
        });
    }
}

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
            <button type="submit">サインイン</button>
        </Form>
    );
}