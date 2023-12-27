import { MetaFunction } from "@netlify/remix-runtime";

export const meta: MetaFunction = () => {
    return [
        { title: "FF14 SNS サインイン" },
        { name: "description", content: "FF14SNSのサインインページです。" },
    ];
}

export default function Signup() {
    return (
        <div>
            <a href="/auth/register">サインイン</a>
        </div>
    );
}