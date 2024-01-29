import { Form } from "@remix-run/react";
import useSnsUser from "../../../contexts/user/use-sns-user";
import styles from "./header.module.css";

export default function Header() {
    const snsUser = useSnsUser();

    return (
        <header className={styles["header"]}>
            <div className={styles["header-contents-area"]}>
                <h1 className={styles["test-class"]}>FF14 SNS</h1>
                <p>{snsUser.userName}</p>
                <Form method="post">
                    <button type="submit">ログアウト</button>
                </Form>
            </div>
        </header>
    );
}