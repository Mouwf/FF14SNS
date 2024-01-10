import PostDisplay from "../../components/post-display";
import PostContent from "../../../models/post/post-content";

export default function LatestPostTimeLine({
    postContents,
}: {
    postContents: PostContent[];
}) {
    return (
        <div>
            {postContents.map((postContent) => {
                return (
                    <div>
                        <PostDisplay postContent={postContent} />
                    </div>
                );
            })}
        </div>
    );
}