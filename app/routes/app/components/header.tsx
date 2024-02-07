import { Form, Link } from "@remix-run/react";
import useSnsUser from "../../../contexts/user/use-sns-user";
import styles from "./header.module.css";

/**
 * アプリケーションのヘッダー。
 * @returns アプリケーションのヘッダー。
 */
export default function Header() {
    const snsUser = useSnsUser();

    return (
        <header className={styles["header"]}>
            <div className={styles["header-contents-area"]}>
                <h1><Link to="/app">FF14 SNS</Link></h1>
                <p>{snsUser.userName}</p>
                <p>{`${snsUser.currentReleaseVersion} ${snsUser.currentReleaseName}`}</p>
                <Link to="/app/setting">設定</Link>
                <Form method="post">
                    <button type="submit">ログアウト</button>
                </Form>
            </div>
        </header>
    );
}