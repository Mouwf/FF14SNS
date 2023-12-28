import HttpRequestError from "./http-request-error";

/**
 * HTTPクライアント。
 */
export default class HttpClient {
    /**
     * エンドポイント。
     */
    private readonly endpoint: string;

    /**
     * HTTPクライアントを生成する。
     * @param baseUrl リクエストのベースURL。
     * @param accessToken アクセストークン。
     * アクセストークンが渡された場合、Bearerトークンとしてリクエストに追加される。
     */
    constructor(
        private readonly baseUrl: string,
        private readonly accessToken: string | null = null,
    ) {
        const url = new URL(baseUrl);
        this.baseUrl = url.origin;
        this.endpoint = `${url.pathname}${url.search}`;
    }

    /**
     * GETリクエストを送信する。
     * @param endpoint エンドポイント。
     * エンドポイントが省略された場合、ベースURLのみを使用する。
     * @param queries クエリ。
     * @returns レスポンス。
     */
    get<T>(endpoint: string = "", queries?: Record<string, string | number>): Promise<T> {
        return this.request<T>("GET", endpoint, queries);
    }

    /**
     * POSTリクエストを送信する。
     * @param endpoint エンドポイント。
     * エンドポイントが省略された場合、ベースURLのみを使用する。
     * @param queries クエリ。
     * @param body リクエストボディ。
     * @returns レスポンス。
     */
    post<T>(endpoint: string = "", queries?: Record<string, string | number>, body?: any): Promise<T> {
        return this.request<T>("POST", endpoint, queries, body);
    }

    /**
     * PUTリクエストを送信する。
     * @param endpoint エンドポイント。
     * エンドポイントが省略された場合、ベースURLのみを使用する。
     * @param queries クエリ。
     * @param body リクエストボディ。
     * @returns レスポンス。
     */
    put<T>(endpoint: string = "", queries?: Record<string, string | number>, body?: any): Promise<T> {
        return this.request<T>("PUT", endpoint, queries, body);
    }

    /**
     * DELETEリクエストを送信する。
     * @param endpoint エンドポイント。
     * エンドポイントが省略された場合、ベースURLのみを使用する。
     * @returns レスポンス。
     */
    delete<T>(endpoint: string = ""): Promise<T> {
        return this.request<T>("DELETE", endpoint);
    }

    /**
     * JSONを取得するリクエストを送信する。
     * @param method メソッド。
     * @param endpoint エンドポイント。
     * エンドポイントが省略された場合、ベースURLのみを使用する。
     * @param queries クエリ。
     * @param body リクエストボディ。
     * @returns JSONレスポンス。
     */
    private async request<T>(method: string, endpoint: string = "", queries?: Record<string, string | number>, body?: any): Promise<T> {
        // クエリをURLに追加する。
        const url = endpoint ? new URL(endpoint, this.baseUrl) : new URL(this.endpoint, this.baseUrl);
        if (queries) {
            for (const[ key, value ] of Object.entries(queries)) {
                url.searchParams.append(key, String(value));
            }
        }

        // レスポンスを返す。
        const response = await this.createRequest(method, `${url.pathname}${url.search}`, body);
        return await response.json() as T;
    }

    /**
     * プレーンテキストを取得するリクエストを送信する。
     * @param method メソッド。
     * @param endpoint エンドポイント。
     * エンドポイントが省略された場合、ベースURLのみを使用する。
     * @param body リクエストボディ。
     * @returns プレーンテキストレスポンス。
     */
    async requestText(method: string, endpoint: string = "", body?: any): Promise<string> {
        // レスポンスを返す。
        const usedEndpoint = endpoint ? endpoint : this.endpoint;
        const response = await this.createRequest(method, usedEndpoint, body);
        return await response.text();
    }

    /**
     * リクエストを送信する。
     * @param method メソッド。
     * @param endpoint エンドポイント。
     * @param body リクエストボディ。
     * @returns レスポンス。
     */
    private async createRequest(method: string, endpoint: string = '', body?: any): Promise<Response> {
        // リクエストに渡すオプションを作成する。
        const options: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
        }

        // アクセストークンがある場合、Bearerトークンとしてオプションに追加する。
        if (this.accessToken) {
            options.headers = {
                ...options.headers,
                "Authorization": `Bearer ${this.accessToken}`,
            }
        }

        // リクエストボディがある場合、オプションに追加する。
        if (body) {
            options.body = JSON.stringify(body);
        }

        // リクエストを送信する。
        const response = await fetch(`${this.baseUrl}${endpoint}`, options);
        if (!response.ok) {
            throw new HttpRequestError(method, `${this.baseUrl}${endpoint}`, response.status, response.statusText);
        }

        // レスポンスを返す。
        return response;
    }
}