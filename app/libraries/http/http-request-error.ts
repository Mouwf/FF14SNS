/**
 * HTTPリクエストエラー。
 */
export default class HttpRequestError extends Error {
    /**
     * HTTPリクエストエラーを生成する。
     * @param method メソッド。
     * @param url URL。
     * @param status ステータス。
     */
    constructor(
        public readonly method: string,
        public readonly url: string,
        public readonly status: number,
        public readonly statusText: string,
    ) {
        super(`HTTPリクエストに失敗しました。\nMethod: ${method} URL: ${url} Status: ${status} StatusText: ${statusText}`)
    }
}