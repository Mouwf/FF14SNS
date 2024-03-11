import PostDisplay from "../../components/post-display/post-display";
import ReplyContent from "../../../models/post/reply-content";

/**
 * リプライ表示。
 * @param replyContents リプライ内容。
 * @returns リプライ表示。
 */
export default function ReplyContents({
    replyContents,
}: {
    replyContents: ReplyContent[];
}) {
    return (
        <div>
            {replyContents.map((replyContent) => {
                return (
                    <PostDisplay key={replyContent.id} isDirectNavigation={false} postContent={replyContent} hasDetailAddress={false} hasInteraction={true} />
                );
            })}
        </div>
    );
}