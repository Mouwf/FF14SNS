import PostDisplay from "../../components/post-display";
import PostContent from "../../../models/post/post-content";

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
        <div>
            {postContents.map((postContent, index) => {
                return (
                    <div key={index}>
                        <PostDisplay postContent={postContent} />
                    </div>
                );
            })}
        </div>
    );
}