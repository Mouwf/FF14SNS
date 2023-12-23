import { MetaFunction, json } from "@netlify/remix-runtime";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Index" },
    { name: "description", content: "IndexDescription" },
  ];
};

export async function loader() {
  return json("Hello World!");
}

export default function Index() {
  const projects = useLoaderData<typeof loader>();

  const [count, setCount] = useState(0);
  const incrementCount = () => {
    setCount(count + 1);
  }

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <h2>{projects}</h2>
      <p>Count: {count}</p>
      <button onClick={incrementCount}>Increment count</button>
      <ul>
        <li>
          <Link to="/parameter-test/test3">Parameter Test</Link>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer noopener"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer noopener"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer noopener"
          >
            Remix Docs
          </a>
        </li>
      </ul>
    </main>
  );
}
