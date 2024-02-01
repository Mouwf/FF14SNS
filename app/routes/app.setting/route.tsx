import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json, redirect } from "@remix-run/node";
import { getSession } from "../../sessions";
import { appLoadContext as context } from "../../dependency-injector/get-load-context";

/**
 * 設定ページのメタ情報を設定する。
 * @returns 設定ページのメタ情報。
 */
export const meta: MetaFunction = () => {
    return [
        { title: "FF14 SNS 設定" },
        { name: "description", content: "FF14SNSの設定ページです。" },
    ];
}

/**
 * ユーザー設定を取得するローダー。
 * @param request リクエスト。
 * @param context コンテキスト。
 */
export const loader = async ({
    request,
}: LoaderFunctionArgs) => {

}