import { LoaderFunctionArgs, json } from "@netlify/remix-runtime";
import PostEntry from "./components/post-entry";
import LatestPostTimeLine from "./components/latest-post-time-line";
import { newlyPostedPostCookie } from "../../cookies.server";
import { useLoaderData } from "@remix-run/react";
import PostContent from "../../models/post/post-content";

export const loader = async ({
    request,
    context,
}: LoaderFunctionArgs) => {
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await newlyPostedPostCookie.parse(cookieHeader)) || {};

    const postContents: PostContent[] = Array.from({
        length: 10,
    }, (_, i) => {
        const incrementedI = i + 1;

        return ({
            id: incrementedI.toString(),
            releaseVersion: "5.5",
            tag: "考察",
            createdAt: new Date(),
            content: `これは${incrementedI}のテストです。これは${incrementedI}のテストです。これは${incrementedI}のテストです。これは${incrementedI}のテストです。これは${incrementedI}のテストです。\nこれは${incrementedI}のテストです。これは${incrementedI}のテストです。これは${incrementedI}のテストです。`,
        });
    });
    if (Object.keys(cookie).length > 0 && cookie.isPosted) {
        return json(postContents);
    }
    return json(postContents);
}

export default function TopIndex() {
    const latestPostContents: PostContent[] = useLoaderData<typeof loader>().map((postContent) => ({
        ...postContent,
        createdAt: new Date(postContent.createdAt),
    }));

    return (
        <div>
            <PostEntry />
            <LatestPostTimeLine postContents={latestPostContents} />
        </div>
    );
}