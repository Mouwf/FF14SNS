import { LoaderFunctionArgs, MetaFunction, json, redirect } from "@netlify/remix-runtime";
import { Outlet, useLoaderData } from "@remix-run/react";
import FirebaseAuthenticatedUserProvider from "../../libraries/user/firebase-authenticated-user-provider";
import FF14SnsUser from "../../libraries/user/ff14-sns-user";
import FF14SnsUserLoader from "../../loaders/user/ff14-sns-user-loader";
import FirebaseUserAccountManager from "../../libraries/authentication/firebase-user-account-manager";
import UserAuthenticationAction from "../../actions/authentication/user-authentication-action";
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
}: LoaderFunctionArgs) => {
    // ログインしていない場合、ログインページにリダイレクトする。
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await userAuthenticationCookie.parse(cookieHeader)) || {};
    if (Object.keys(cookie).length <= 0) return redirect("/auth/login");

    // FF14SNSのユーザーを取得する。
    try {
        const authenticatedUserProvider = new FirebaseAuthenticatedUserProvider();
        const ff14SnsUserLoader = new FF14SnsUserLoader(authenticatedUserProvider);
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

export const action = async () => {
    try {
        // ログアウトする。
        const userAccountManager = new FirebaseUserAccountManager();
        const userAuthenticationAction = new UserAuthenticationAction(userAccountManager);
        await userAuthenticationAction.logout();

        // IDトークンとリフレッシュトークンをCookieから削除する。
        return redirect("/auth/login", {
            headers: {
                "Set-Cookie": await userAuthenticationCookie.serialize({}),
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