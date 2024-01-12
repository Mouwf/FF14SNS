import { Link, useFetcher } from "@remix-run/react";
import useSnsUser from "../../contexts/user/use-sns-user";
import PostContent from "../../models/post/post-content";

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
            <div>
                {reactionTypes.map((reactionType, index) => {
                    const reactionName = reactionNames[index];

                    return (
                        <div key={index}>
                            <fetcher.Form method="post" action="app/like">
                                <input type="hidden" name="reaction" value={reactionType} />
                                <button type="submit">{reactionName}</button>
                            </fetcher.Form>
                        </div>
                    );
                })}
            </div>
        );
    }

    const snsUser = useSnsUser();

    return (
        <div>
            <div>
                <p>{snsUser.name}</p>
                <span>{postContent.releaseVersion}</span>
                <span>{postContent.tag}</span>
                {getPostTime()}
            </div>
            <div>
                <p>{postContent.content}</p>
            </div>
            <div>
                <div>
                    <Link to="app/reply">リプライ</Link>
                    <button>リポスト</button>
                </div>
                {getReaction()}
            </div>
        </div>
    );
}