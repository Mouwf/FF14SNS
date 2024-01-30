import { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Header from "./components/header";
import Footer from "./components/footer";

/**
 * 認証ページのメタ情報を設定する。
 * @returns 認証ページのメタ情報。
 */
export const meta: MetaFunction = () => {
    return [
        { title: "FF14 SNS" },
        { name: "description", content: "FF14SNSは安心してネタバレをつぶやくことのできるSNSです。" },
    ];
}

/**
 * 認証ページ。
 * @returns 認証ページ。
 */
export default function Auth() {
    return (
        <main>
            <Header />
            <h1>FF14 SNS</h1>
            <Outlet />
            <Footer />
        </main>
    );
}