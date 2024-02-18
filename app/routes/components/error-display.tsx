/**
 * エラーメッセージを表示するコンポーネント。
 * @param errorMessage エラーメッセージ。
 * @returns エラーメッセージを表示するコンポーネント。
 */
export default function ErrorDisplay({
    errorMessage,
}: {
    errorMessage: string,
}) {
    return (
        <div>
            <p>{errorMessage}</p>
        </div>
    )
}