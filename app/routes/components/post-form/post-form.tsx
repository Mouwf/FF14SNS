import { Form } from "@remix-run/react";
import useSnsUser from "../../../contexts/user/use-sns-user";
import PostUserProfileImage from "../post-display/post-user-profile-image";
import { ReactNode } from "react";

/**
 * 投稿フォーム。
 * @returns 投稿フォーム。
 */
export default function PostForm({
    children,
    submitMessage,
}: {
    children?: ReactNode,
    submitMessage: string;
}) {
    const snsUser = useSnsUser();

    return (
        <Form method="post">
            <PostUserProfileImage />
            <p>{snsUser.userName}</p>
            {children}
            <div>
                <textarea name="content" placeholder="メッセージを入力してください" />
            </div>
            <div>
                <button type="submit">{submitMessage}</button>
            </div>
        </Form>
    );
}