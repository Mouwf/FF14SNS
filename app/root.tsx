import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import styles from "./styles/global.css";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import SystemMessageProvider from "./contexts/system-message/system-message-provider";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: cssBundleHref },
  ] : []),
];

export default function App() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <SystemMessageProvider>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </SystemMessageProvider>
      </body>
    </html>
  );
}
