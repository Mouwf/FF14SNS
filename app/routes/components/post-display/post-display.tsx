import { Link } from "@remix-run/react";
import PostContent from "../../../models/post/post-content";
import styles from "./post-display.module.css";
import PostUserProfileImage from "./post-user-profile-image";
import PostDisplayHeader from "./post-display-header";
import PostMessage from "./post-message";
import PostInteraction from "./post-interaction";

/**
 * 投稿表示。
 * @param postContent 投稿内容。
 * @returns 投稿表示。
 */
export default function PostDisplay({
    postContent,
    isDirectNavigation,
    hasDetailAddress,
    hasInteraction,
}: {
    postContent: PostContent;
    isDirectNavigation: boolean;
    hasDetailAddress: boolean;
    hasInteraction: boolean;
}) {
    const postDetailAddress = "originalPostId" in postContent ? `/app/post-detail/${postContent.originalPostId}/${postContent.id}` : `/app/post-detail/${postContent.id}`;
    const getPostHeaderAndMessage = () => {
        return (
            <div>
                <PostDisplayHeader
                    posterName={postContent.posterName}
                    releaseVersion={postContent.releaseVersion}
                    releaseName={postContent.releaseName}
                    createdAt={postContent.createdAt}
                />
                <PostMessage postMessage={postContent.content} />
            </div>
        );
    }

    return (
        <div className={styles["post"]}>
            <PostUserProfileImage />
            <div className={styles["post-contents-area"]}>
                {hasDetailAddress
                    ? <Link to={postDetailAddress}>
                        {getPostHeaderAndMessage()}
                    </Link>
                    : <div>
                        {getPostHeaderAndMessage()}
                    </div>
                }
                {hasInteraction &&
                    <PostInteraction postContent={postContent} isDirectNavigation={isDirectNavigation} />
                }
            </div>
        </div>
    );
}