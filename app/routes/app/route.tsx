import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from "@netlify/remix-runtime";
import { Outlet, useLoaderData } from "@remix-run/react";
import FF14SnsUser from "../../libraries/user/ff14-sns-user";
import { userAuthenticationCookie } from "../../cookies.server";
import Header from "./components/header";
import Footer from "./components/footer";

export const meta: MetaFunction = () => {
    return [
        { title: "FF14 SNS" },
        { name: "description", content: "FF14SNSのトップです。" },
    ];
}

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

export default function App() {
    const ff14SnsUserJson = useLoaderData<typeof loader>();
    const ff14SnsUser: FF14SnsUser = {
        name: ff14SnsUserJson.name,
    };

    return (
        <main>
            <Header ff14SnsUser={ff14SnsUser} />
            <h1>FF14 SNS</h1>
            <Outlet />
            <Footer />
        </main>
    );
}