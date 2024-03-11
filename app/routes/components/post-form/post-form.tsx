import { Form } from "@remix-run/react";
import useSnsUser from "../../../contexts/user/use-sns-user";
import PostUserProfileImage from "../post-display/post-user-profile-image";
import { ReactNode } from "react";
import styles from "./post-form.module.css";

/**
 * 投稿フォーム。
 * @returns 投稿フォーム。
 */
export default function PostForm({
    children,
    submitMessage,
}: {
    children?: ReactNode,
    submitMessage: string;
}) {
    const snsUser = useSnsUser();

    return (
        <Form className={styles["post-message-area"]} method="post">
            <PostUserProfileImage />
            <p>{snsUser.userName}</p>
            <div className={styles["post-message-container"]}>
                {children}
                <div className={styles["post-message"]}>
                    <textarea name="content" placeholder="今日はどんな冒険をしましたか？" />
                </div>
                <div className={styles["post-message-btn"]}>
                    <button type="submit">{submitMessage}</button>
                </div>
            </div>
        </Form>
    );
}