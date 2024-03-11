import styles from "./post-message.module.css";

/**
 * 投稿内容。
 * @param postMessage 投稿内容。
 * @returns 投稿内容。
 */
export default function PostMessage({
    postMessage,
}: {
    postMessage: string;
}) {
    return (
        <div className={styles["post-message-area"]}>
            <p>{postMessage}</p>
        </div>
    );
}