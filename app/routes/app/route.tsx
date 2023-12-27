import { MetaFunction } from "@netlify/remix-runtime";
import { Outlet } from "@remix-run/react";
import Header from "./components/header";
import Footer from "./components/footer";

export const meta: MetaFunction = () => {
    return [
        { title: "FF14 SNS" },
        { name: "description", content: "FF14SNSのトップです。" },
    ];
}

export default function App() {
    return (
        <main>
            <Header />
            <h1>FF14 SNS</h1>
            <Outlet />
            <Footer />
        </main>
    );
}