import systemMessages from "../../messages/system-messages";
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { getSession } from "../../sessions";
import { appLoadContext as context } from "../../dependency-injector/get-load-context";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import ErrorDisplay from "../components/error-display";
import SystemMessageContext from "../../contexts/system-message/system-message-context";

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
 * ユーザー設定と全てのリリース情報を取得するローダー。
 * @param request リクエスト。
 * @param context コンテキスト。
 */
export const loader = async ({
    request,
}: LoaderFunctionArgs) => {
    try {
        // ユーザー設定を取得する。
        const cookieHeader = request.headers.get("Cookie");
        const session = await getSession(cookieHeader);
        const profileId = session.get("userId") as string;
        const userSettingLoader = context.userSettingLoader;
        const userSetting = await userSettingLoader.fetchUserSettingByProfileId(profileId);

        // リリース情報を全件取得する。
        const releaseInformationLoader = context.releaseInformationLoader;
        const allReleaseInformation = await releaseInformationLoader.getAllReleaseInformation();

        // ユーザー設定と全てのリリース情報を返す。
        return json({
            userSetting,
            allReleaseInformation,
        });
    } catch (error) {
        console.error(error);
        if (error instanceof TypeError || error instanceof Error) return json({ errorMessage: error.message });
        return json({ errorMessage: systemMessages.error.unknownError });
    }
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

        // 成功メッセージを返す。
        return json({ successMessage: systemMessages.success.userSettingSaved });
    } catch (error) {
        console.error(error);
        if (error instanceof TypeError || error instanceof Error) return json({ errorMessage: error.message });
        return json({ errorMessage: systemMessages.error.unknownError });
    }
}

/**
 * 設定ページ。
 */
export default function Setting() {
    // システムメッセージを取得する。
    const loaderData = useLoaderData<typeof loader>();
    const loaderErrorMessage = "errorMessage" in loaderData ? loaderData.errorMessage : "";
    const actionData = useActionData<typeof action>();
    const actionSuccessMessage = actionData && "successMessage" in actionData ? actionData.successMessage : "";
    const actionErrorMessage = actionData && "errorMessage" in actionData ? actionData.errorMessage : "";

    // システムメッセージを表示する。
    const { showSystemMessage } = useContext(SystemMessageContext);
    useEffect(() => {
        showSystemMessage("error", loaderErrorMessage);
    }, [loaderData]);
    useEffect(() => {
        showSystemMessage("success", actionSuccessMessage);
        showSystemMessage("error", actionErrorMessage);
    }, [actionData]);

    // ローダーでエラーが発生した場合、エラーメッセージを表示するコンポーネントを表示する。
    if ("errorMessage" in loaderData) {
        return (
            <ErrorDisplay errorMessage={loaderErrorMessage} />
        );
    }

    // ユーザー設定を取得する。
    const userSetting = loaderData.userSetting;

    // リリース情報を全件表示する。
    const [currentReleaseInformationId, setCurrentReleaseInformationId] = useState(userSetting.currentReleaseInformationId);
    const allReleaseInformation = loaderData.allReleaseInformation;
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
                    <label>
                        <span>現在のパッチ</span>
                        {getReleaseVersionOptions()}
                    </label>
                </div>
                <button type="submit">設定</button>
            </Form>
        </div>
    );
}