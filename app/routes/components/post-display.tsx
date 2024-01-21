import { Link, useFetcher } from "@remix-run/react";
import useSnsUser from "../../contexts/user/use-sns-user";
import PostContent from "../../models/post/post-content";
import styles from "./post-display.module.css";

/**
 * 投稿表示。
 * @param postContent 投稿内容。
 * @returns 投稿表示。
 */
export default function PostDisplay({
    postContent,
}: {
    postContent: PostContent;
}) {
    const fetcher = useFetcher();
    const reactionTypes = ["like", "love", "wow"];
    const reactionNames = ["いいね", "ラブ", "ワオ！"];

    const getPostTime = () => {
        const postDate = postContent.createdAt;
        const formattedDate = postDate.toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });

        return (
            <time>{formattedDate}</time>
        );
    }

    const getReaction = () => {
        return (
            <div className={styles["test5"]}>
                {reactionTypes.map((reactionType, index) => {
                    const reactionName = reactionNames[index];

                    return (
                        <fetcher.Form key={index} method="post" action="app/like">
                            <input type="hidden" name="reaction" value={reactionType} />
                            <button type="submit">{reactionName}</button>
                        </fetcher.Form>
                    );
                })}
            </div>
        );
    }

    const snsUser = useSnsUser();

    return (
        <div className={styles["test"]}>
            <div className={styles["test3"]}></div>
            <div className={styles["test4"]}>
                <div className={styles["test8"]}>
                    <div>
                        <p className={styles["test7"]}>{snsUser.name}</p>
                        <time>{postContent.releaseVersion}</time>
                        <span>{postContent.tag}</span>
                    </div>
                    <div>
                        {getPostTime()}
                    </div>
                </div>
                <div>
                    <p>{postContent.content}</p>
                </div>
                <div className={styles["test6"]}>
                    <div>
                        <Link to="app/reply">リプライ</Link>
                        <button>リポスト</button>
                    </div>
                    {getReaction()}
                </div>
            </div>
        </div>
    );
}