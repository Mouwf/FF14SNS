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
            <time className={styles["post-date"]}>{formattedDate}</time>
        );
    }

    const getReaction = () => {
        return (
            <div className={styles["post-emotions"]}>
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
        <div className={styles["post"]}>
            <div className={styles["post-user-img-area"]}>
                <img src="/images/dummy-profile.png" alt="" />
            </div>
            <div className={styles["post-contents-area"]}>
                <div className={styles["post-basic-information"]}>
                    <div className={styles["post-about"]}>
                        <p className={styles["post-user-name"]}>{snsUser.name}</p>
                        <div>
                            <span className={styles["post-release-version"]}>{postContent.releaseVersion}</span>
                            <span>{postContent.tag}</span>
                        </div>
                    </div>
                    <div>
                        {getPostTime()}
                    </div>
                </div>
                <div className={styles["post-main-contents-area"]}>
                    <p>{postContent.content}</p>
                </div>
                <div className={styles["post-reactions-area"]}>
                    <div className={styles["post-reactions"]}>
                        <div className={styles["post-reply"]}>
                            <Link to="app/reply">
                                <div className={styles["post-reply-x-position"]}>
                                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.3 0H1.7C0.765 0 0 0.765 0 1.7V11.9C0 12.835 0.765 13.6 1.7 13.6H13.6L17 17V1.7C17 0.765 16.235 0 15.3 0ZM15.3 12.92L14.28 11.9H1.7V1.7H15.3V12.92Z" fill="#737373"/>
                                    </svg>
                                </div>
                            </Link>
                        </div>
                        <div>
                            <button>リポスト</button>
                        </div>
                    </div>
                    {getReaction()}
                </div>
            </div>
        </div>
    );
}