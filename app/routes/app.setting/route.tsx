import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { getSession } from "../../sessions";
import { appLoadContext as context } from "../../dependency-injector/get-load-context";
import { Form, useLoaderData } from "@remix-run/react";
import { ChangeEvent, useState } from "react";

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
    // ユーザー設定を取得する。
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const profileId = session.get("userId") as string;
    const userSettingLoader = context.userSettingLoader;
    const userSetting = await userSettingLoader.getUserSettingByProfileId(profileId);

    // リリース情報を全件取得する。
    const releaseInformationLoader = context.releaseInformationLoader;
    const allReleaseInformation = await releaseInformationLoader.getAllReleaseInformation();

    return json({
        userSetting,
        allReleaseInformation,
    });
}

/**
 * 設定を更新するアクション。
 * @param request リクエスト。
 * @param context コンテキスト。
 */
export const action = async ({
    request,
}: ActionFunctionArgs) => {
    try {
        // プロフィールIDを取得する。
        const cookieHeader = request.headers.get("Cookie");
        const session = await getSession(cookieHeader);
        const profileId = session.get("userId") as string;

        // フォームデータを取得する。
        const formData = await request.formData();
        const userName = formData.get("userName") as string;
        const currentReleaseInformationId = Number(formData.get("currentReleaseInformationId"));

        // ユーザー設定を更新する。
        const userSetting = {
            userId: profileId,
            userName: userName,
            currentReleaseInformationId: currentReleaseInformationId,
        };
        const userSettingAction = context.userSettingAction;
        await userSettingAction.editUserSetting(userSetting);

        // 成功を返す。
        return json({ success: true });
    } catch (error) {
        console.error(error);
        return json({ error: "設定の更新に失敗しました。" });
    }
}

/**
 * 設定ページ。
 */
export default function Setting() {
    const settingLoaderData = useLoaderData<typeof loader>();
    const userSetting = settingLoaderData.userSetting;

    const [currentReleaseInformationId, setCurrentReleaseInformationId] = useState(userSetting.currentReleaseInformationId);
    const allReleaseInformation = settingLoaderData.allReleaseInformation;
    const handleCurrentReleaseInformationIdChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setCurrentReleaseInformationId(Number(event.target.value));
    }
    const getReleaseVersionOptions = () => {
        return <select name="currentReleaseInformationId" value={currentReleaseInformationId} onChange={handleCurrentReleaseInformationIdChange}>
            {allReleaseInformation.map((releaseInformation) => {
                return <option key={releaseInformation.id} value={releaseInformation.id}>{`${releaseInformation.releaseVersion} ${releaseInformation.releaseName}`}</option>;
            })}
        </select>;
    }

    return (
        <div>
            <h1>設定</h1>
            <p>ユーザー名:{userSetting.userName}</p>
            <Form method="post">
                <input type="hidden" name="userName" value={userSetting.userName} />
                <div>
                    <label htmlFor="currentReleaseInformationId">現在のパッチ</label>
                    {getReleaseVersionOptions()}
                </div>
                <button type="submit">設定</button>
            </Form>
        </div>
    );
}