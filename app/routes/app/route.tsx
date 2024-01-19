import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from "@netlify/remix-runtime";
import { Outlet, useLoaderData } from "@remix-run/react";
import SnsUserProvider from "../../contexts/user/sns-user-provider";
import { userAuthenticationCookie } from "../../cookies.server";
import Header from "./components/header";
import Footer from "./components/footer";
import SnsUser from "../../models/user/sns-user";

/**
 * トップページのメタ情報を設定する。
 * @returns トップページのメタ情報。
 */
export const meta: MetaFunction = () => {
    return [
        { title: "FF14 SNS" },
        { name: "description", content: "FF14SNSのトップです。" },
    ];
}

/**
 * SNSのユーザーを取得するローダー。
 * @param request リクエスト。
 * @param context コンテキスト。
 * @returns SNSのユーザー。
 * @throws ログインしていない場合、ログインページにリダイレクトする。
 */
export const loader = async ({
    request,
    context,
}: LoaderFunctionArgs) => {
    try {
        // ログインしていない場合、ログインページにリダイレクトする。
        const cookieHeader = request.headers.get("Cookie");
        const cookie = (await userAuthenticationCookie.parse(cookieHeader)) || {};
        if (Object.keys(cookie).length <= 0) return redirect("/auth/login", {
            headers: {
                "Set-Cookie": await userAuthenticationCookie.serialize({}),
            },
        });

        // 認証済みユーザーを取得する。
        const authenticatedUserLoader = context.authenticatedUserLoader;
        const authenticatedUser = await authenticatedUserLoader.getUser(cookie.idToken);

        // 認証済みユーザーが存在しない場合、ユーザー登録ページにリダイレクトする。
        if (!authenticatedUser) {
            return redirect("/auth/register-user");
        }

        // SNSのユーザーを返す。
        const snsUser: SnsUser = {
            userName: authenticatedUser.userName,
        };
        return json(snsUser);
    } catch (error) {
        console.error(error);
        throw redirect("/auth/login", {
            headers: {
                "Set-Cookie": await userAuthenticationCookie.serialize({}),
            },
        });
    }
}

/**
 * ログアウトするアクション。
 * @param request リクエスト。
 * @param context コンテキスト。
 * @returns ログインページにリダイレクトする。
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

        // ログアウトする。
        const userAuthenticationAction = context.userAuthenticationAction;
        await userAuthenticationAction.logout(cookie.idToken);

        // IDトークンとリフレッシュトークンをCookieから削除する。
        return redirect("/auth/login", {
            headers: {
                "Set-Cookie": await userAuthenticationCookie.serialize({}),
            },
        });
    } catch (error) {
        console.error(error);
        throw redirect("/auth/login", {
            headers: {
                "Set-Cookie": await userAuthenticationCookie.serialize({}),
            },
        });
    }
}

/**
 * トップページ。
 * @returns トップページ。
 */
export default function Top() {
    const snsUser: SnsUser = useLoaderData<typeof loader>();

    return (
        <main>
            <SnsUserProvider snsUser={snsUser}>
                <Header />
                <Outlet />
                <Footer />
            </SnsUserProvider>
        </main>
    );
}