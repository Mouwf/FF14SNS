import { Form } from "@remix-run/react";
import useSnsUser from "../../../contexts/user/use-sns-user";

export default function Header() {
    const snsUser = useSnsUser();

    return (
        <header>
            <h1>FF14 Header</h1>
            <p>{snsUser.userName}</p>
            <Form method="post">
                <button type="submit">ログアウト</button>
            </Form>
        </header>
    );
}