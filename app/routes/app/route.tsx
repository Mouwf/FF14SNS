import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from "@netlify/remix-runtime";
import { Outlet, useLoaderData } from "@remix-run/react";
import FF14SnsUser from "../../libraries/user/ff14-sns-user";
import SnsUserProvider from "../../contexts/user/sns-user-provider";
import { userAuthenticationCookie } from "../../cookies.server";
import Header from "./components/header";
import Footer from "./components/footer";

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
 * FF14SNSのユーザーを取得するローダー。
 * @param request リクエスト。
 * @param context コンテキスト。
 * @returns FF14SNSのユーザー。
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

        // FF14SNSのユーザーを取得する。
        const ff14SnsUserLoader = context.ff14SnsUserLoader;
        const ff14SnsUser = await ff14SnsUserLoader.getUser(cookie.idToken);
        return json(ff14SnsUser);
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
    const ff14SnsUser: FF14SnsUser = useLoaderData<typeof loader>();

    return (
        <main>
            <SnsUserProvider snsUser={ff14SnsUser}>
                <Header />
                <Outlet />
                <Footer />
            </SnsUserProvider>
        </main>
    );
}