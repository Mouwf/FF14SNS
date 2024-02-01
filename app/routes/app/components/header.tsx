import { Form, Link } from "@remix-run/react";
import useSnsUser from "../../../contexts/user/use-sns-user";

/**
 * アプリケーションのヘッダー。
 * @returns アプリケーションのヘッダー。
 */
export default function Header() {
    const snsUser = useSnsUser();

    return (
        <header>
            <h1><Link to="/app">FF14 Header</Link></h1>
            <p>{snsUser.userName}</p>
            <Link to="/app/setting">設定</Link>
            <Form method="post">
                <button type="submit">ログアウト</button>
            </Form>
        </header>
    );
}