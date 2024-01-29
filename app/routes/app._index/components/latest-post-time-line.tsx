import PostDisplay from "../../components/post-display";
import PostContent from "../../../models/post/post-content";
import styles from "./latest-post-time-line.module.css";

/**
 * 最新の投稿を表示するコンポーネント。
 * @param postContents 全ての投稿。
 * @returns 最新の投稿を表示するコンポーネント。
 */
export default function LatestPostTimeLine({
    postContents,
}: {
    postContents: PostContent[];
}) {
    return (
        <div className={styles["post-time-line"]}>
            {postContents.map((postContent) => {
                return (
                    <PostDisplay key={postContent.id} postContent={postContent} />
                );
            })}
        </div>
    );
}