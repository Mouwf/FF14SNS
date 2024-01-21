import { Form } from "@remix-run/react";
import useSnsUser from "../../../contexts/user/use-sns-user";
import styles from "./header.module.css";

export default function Header() {
    const ff14SnsUser = useSnsUser();

    return (
        <header className={styles["header"]}>
            <div className={`${styles['header-contents-area']} ${styles['content-bg-style']}`}>
                <h1 className={styles["test-class"]}>FF14 SNS</h1>
                <p>{ff14SnsUser.name}</p>
                <Form method="post">
                    <button type="submit">ログアウト</button>
                </Form>
            </div>
        </header>
    );
}