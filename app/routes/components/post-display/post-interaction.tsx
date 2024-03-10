import { Link, useFetcher } from "@remix-run/react";
import PostContent from "../../../models/post/post-content";
import styles from "./post-interaction.module.css";

/**
 * 投稿のインタラクション。
 * @param postContent 投稿内容。
 * @returns 投稿のインタラクション。
 */
export default function PostInteraction({
    postContent,
    isDirectNavigation,
}: {
    postContent: PostContent;
    isDirectNavigation: boolean;
}) {
    const directNavigation = isDirectNavigation ? "direct" : "indirect";
    const replyAddress = "originalPostId" in postContent ? `/app/reply-message/${postContent.originalPostId}/${postContent.id}/${directNavigation}` : `/app/reply-message/${postContent.id}/${directNavigation}`;

    const fetcher = useFetcher();
    const reactionTypes = ["like", "love", "wow"];
    const reactionNames = ["いいね", "ラブ", "ワオ！"];
    const getReaction = () => {
        return (
            <div className={styles["post-reaction"]}>
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

    return (
        <div className={styles["post-engagement-area"]}>
            <div className={styles["post-interaction-area"]}>
                <div className={styles["post-reply"]}>
                    <Link to={replyAddress}>
                        <div className={styles["post-reply-x-position"]}>
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.3 0H1.7C0.765 0 0 0.765 0 1.7V11.9C0 12.835 0.765 13.6 1.7 13.6H13.6L17 17V1.7C17 0.765 16.235 0 15.3 0ZM15.3 12.92L14.28 11.9H1.7V1.7H15.3V12.92Z" fill="#737373"/>
                            </svg>
                            {postContent.replyCount > 0 &&
                                <span>
                                    {postContent.replyCount}
                                </span>
                            }
                        </div>
                    </Link>
                </div>
                <div>
                    <button>リポスト</button>
                </div>
            </div>
            {getReaction()}
        </div>
    );
}