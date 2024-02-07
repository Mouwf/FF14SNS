import { Link } from "@remix-run/react";
import useSnsUser from "../../../contexts/user/use-sns-user";
import styles from "./post-entry.module.css";

/**
 * 投稿エントリー。
 * @returns 投稿エントリー。
 */
export default function PostEntry() {
    const snsUser = useSnsUser();

    return (
        <Link to="/app/post-message">
            <div className={styles["post-entry-area"]}>
                <p>{snsUser.userName}</p>
                <p>投稿</p>
            </div>
        </Link>
    );
}