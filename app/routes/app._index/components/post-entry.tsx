import { Link } from "@remix-run/react";
import useSnsUser from "../../../contexts/user/use-sns-user";

/**
 * 投稿エントリー。
 * @returns 投稿エントリー。
 */
export default function PostEntry() {
    const snsUser = useSnsUser();

    return (
        <Link to="/app/post-message">
            <p>{snsUser.userName}</p>
            <p>投稿</p>
        </Link>
    );
}