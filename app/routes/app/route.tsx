import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import SnsUserProvider from "../../contexts/user/sns-user-provider";
import { commitSession, destroySession, getSession } from "../../sessions";
import Header from "./components/header";
import Footer from "./components/footer";
import SnsUser from "../../models/user/sns-user";
import { appLoadContext as context } from "../../dependency-injector/get-load-context";
import styles from "./route.module.css";

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
}: LoaderFunctionArgs) => {
    try {
        // ユーザー登録が完了していない場合、ユーザー登録ページにリダイレクトする。
        const cookieHeader = request.headers.get("Cookie");
        const session = await getSession(cookieHeader);
        if (session.has("idToken") && !session.has("userId")) {
            return redirect("/auth/register-user", {
                headers: {
                    "Set-Cookie": await commitSession(session),
                },
            });
        }

        // ログインしていない場合、ログインページにリダイレクトする。
        if (!session.has("userId")) {
            return redirect("/auth/login", {
                headers: {
                    "Set-Cookie": await destroySession(session),
                },
            });
        }

        // 認証済みユーザーを取得する。
        const profileId = session.get("userId") as string;
        const authenticatedUserLoader = context.authenticatedUserLoader;
        const authenticatedUser = await authenticatedUserLoader.getUserByProfileId(profileId);

        // 認証済みユーザーが存在しない場合、ユーザー登録ページにリダイレクトする。
        if (!authenticatedUser) {
            session.unset("userId");
            return redirect("/auth/register-user", {
                headers: {
                    "Set-Cookie": await commitSession(session),
                },
            });
        }

        // SNSのユーザーを返す。
        const snsUser: SnsUser = {
            userId: authenticatedUser.profileId,
            userName: authenticatedUser.userName,
            currentReleaseVersion: authenticatedUser.currentReleaseVersion,
            currentReleaseName: authenticatedUser.currentReleaseName,
        };
        return json(snsUser, {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
    } catch (error) {
        console.error(error);

        // エラーが発生した場合、ログインページにリダイレクトする。
        const cookieHeader = request.headers.get("Cookie");
        const session = await getSession(cookieHeader);
        throw redirect("/auth/login", {
            headers: {
                "Set-Cookie": await destroySession(session),
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
}: ActionFunctionArgs) => {
    try {
        // ログアウトする。
        const cookieHeader = request.headers.get("Cookie");
        const session = await getSession(cookieHeader);
        const idToken = session.get("idToken") as string;
        const userAuthenticationAction = context.userAuthenticationAction;
        await userAuthenticationAction.logout(idToken);

        // IDトークンとリフレッシュトークンをCookieから削除する。
        return redirect("/auth/login", {
            headers: {
                "Set-Cookie": await destroySession(session),
            },
        });
    } catch (error) {
        console.error(error);

        // エラーが発生した場合、ログインページにリダイレクトする。
        const cookieHeader = request.headers.get("Cookie");
        const session = await getSession(cookieHeader);
        throw redirect("/auth/login", {
            headers: {
                "Set-Cookie": await destroySession(session),
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
                <div className={styles["top-layout"]}>
                    <Header />
                    <Outlet />
                </div>
                <Footer />
            </SnsUserProvider>
        </main>
    );
}