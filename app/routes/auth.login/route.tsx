import { Form } from "@remix-run/react";

export const meta: MetaFunction = () => {
    return [
        { title: "FF14 SNS ログイン" },
        { name: "description", content: "FF14SNSのログインページです。" },
    ];
}

export default function Login() {
    return (
        <Form method="post">
            <label>
                <span>メールアドレス</span>
                <input type="email" name="email" />
            </label>
            <label>
                <span>パスワード</span>
                <input type="password" name="password" />
            </label>
            <button type="submit">ログイン</button>
        </Form>
    );
}