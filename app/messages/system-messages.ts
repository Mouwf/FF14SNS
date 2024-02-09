import Messages from './messages';

/**
 * システムメッセージ。
 */
const systemMessages: Messages = {
    error: {
        networkError: "ネットワークエラーが発生しました。",
        authenticationProviderError: "認証プロバイダが利用できません。",
        authenticationProviderEnvironmentVariableError: "認証プロバイダの環境変数が設定されていません。",
        authenticationProviderTestEnvironmentVariableError: "認証プロバイダのテスト環境変数が設定されていません。",
        databaseError: "データベースエラーが発生しました。",
        databaseEnvironmentVariableError: "データベースの環境変数が設定されていません。",
        databaseTestEnvironmentVariableError: "データベースのテスト環境変数が設定されていません。",
        databasepoolError: "データベースプールでエラーが発生しました。",
        databaseConnectionError: "データベースクライアントでエラーが発生しました。",
        invalidMailAddress: "メールアドレスが不正です。",
        invalidPasswordOnSetting: "パスワードは8文字以上の英数字で設定してください。",
        invalidMailAddressOrPassword: "メールアドレスまたはパスワードが間違っています。",
        authenticationFailed: "認証に失敗しました。ログインし直してください。",
        authenticationProviderIdRetrievalFailed: "認証プロバイダIDの取得に失敗しました。",
        logoutFailed: "ログアウトに失敗しました。",
        invalidUserName: "ユーザー名は「username@world」で入力してください。",
        userRegistrationFailed: "ユーザー登録に失敗しました。",
        userNotExists: "ユーザーが存在しません。",
        userRetrievalFailed: "ユーザー情報の取得に失敗しました。",
        userDeletionFailed: "ユーザーの削除に失敗しました。",
        userSettingEditFailed: "ユーザー設定の編集に失敗しました。",
        userSettingRetrievalFailed: "ユーザー設定の取得に失敗しました。",
        postFailed: "投稿に失敗しました。",
        postRetrievalFailed: "投稿の取得に失敗しました。",
        postDeletionFailed: "投稿の削除に失敗しました。",
        releaseInformationRetrievalFailed: "リリース情報の取得に失敗しました。",
        releaseInformationNotExists: "リリース情報が存在しません。",
    },
    success: {
        userSettingSaved: "ユーザー設定を保存しました。",
    },
}
export default systemMessages;