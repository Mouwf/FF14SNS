import { Form } from "@remix-run/react";
import FF14SnsUser from "../../../libraries/user/ff14-sns-user";

interface HeaderProps {
    ff14SnsUser: FF14SnsUser;
}

export default function Header({
    ff14SnsUser
}: HeaderProps) {
    return (
        <header>
            <h1>FF14 Header</h1>
            <p>{ff14SnsUser.name}</p>
            <Form method="post">
                <button type="submit">ログアウト</button>
            </Form>
        </header>
    );
}