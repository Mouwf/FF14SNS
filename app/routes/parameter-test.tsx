import { MetaFunction, json } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const meta: MetaFunction = () => {
    return [
        { title: "ParameterTest" },
        { name: "description", content: "ParameterTestDescription" },
    ];
}

export default function ParameterTest() {
    return (
        <main>
            <h1>ParameterTest</h1>
            <Outlet />
        </main>
    );
}