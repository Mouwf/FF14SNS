import { Form } from "@remix-run/react";
import useSnsUser from "../../../contexts/user/use-sns-user";
import PostUserProfileImage from "../../components/post-display/post-user-profile-image";

/**
 * リプライフォーム。
 * @returns リプライフォーム。
 */
export default function ReplyForm() {
    const snsUser = useSnsUser();

    return (
        <Form method="post">
            <PostUserProfileImage />
            <p>{snsUser.userName}</p>
            <textarea name="content" placeholder="メッセージを入力してください" />
            <button type="submit">返信</button>
        </Form>
    );
}