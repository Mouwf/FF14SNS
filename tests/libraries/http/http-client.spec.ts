import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import HttpClient from "../../../app/libraries/http/http-client";
import HttpRequestError from "../../../app/libraries/http/http-request-error";

/**
 * ベースURL。
 */
const baseUrl = "https://example.com";

/**
 * アクセストークン。
 */
const accessToken = "test-token";

/**
 * HTTPクライアント。
 */
let httpClient: HttpClient;

/**
 * fetch関数のモックレスポンスを生成する。
 * @param status ステータスコード。
 * @param statusText ステータステキスト。
 * @param body レスポンスボディ。
 * @returns モックレスポンス。
 */
const mockResponse = (status: number, statusText: string, body: string) => {
    return new Response(body, {
        status,
        statusText,
        headers: {
            "Content-type": "application/json",
        }
    });
}

beforeEach(() => {
    httpClient = new HttpClient(baseUrl, accessToken);
});

describe("get", () => {
    test("get should send GET request with queries.", async () => {
        // fetch APIをモックする。
        const expectedResponse = {
            result: "test",
        };
        global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(200, "OK", JSON.stringify(expectedResponse)));

        // GETリクエストを送信する。
        const endpoint = "/test";
        const queries = {
            foo: "bar",
            baz: 123,
        };
        const response = await httpClient.get(endpoint, queries);

        // 結果を検証する。
        const expectedUrl = `${baseUrl}${endpoint}?foo=bar&baz=123`;
        expect(fetch).toBeCalledWith(expectedUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });
        expect(response).toEqual(expectedResponse);
    });

    test("get should correctly encode query parameters.", async () => {
        // fetch APIをモックする。
        const expectedResponse = {
            result: "test",
        };
        global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(200, "OK", JSON.stringify(expectedResponse)));
    
        // GETリクエストを送信する。
        const endpoint = "/test";
        const specialChars = "chars &=%";
        const queries = {
            special: specialChars,
        };
        const response = await httpClient.get(endpoint, queries);
    
        // 結果を検証する。
        const url = new URL(endpoint, baseUrl);
        url.searchParams.append("special", String(specialChars));
        const expectedUrl = `${baseUrl}${endpoint}${url.search}`;
        expect(fetch).toBeCalledWith(expectedUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });
        expect(response).toEqual(expectedResponse);
    });

    test("get should send GET request without queries.", async () => {
        // fetch APIをモックする。
        const expectedResponse = {
            result: "test",
        };
        global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(200, "OK", JSON.stringify(expectedResponse)));

        // GETリクエストを送信する。
        const endpoint = "/test";
        const response = await httpClient.get(endpoint);

        // 結果を検証する。
        const expectedUrl = `${baseUrl}${endpoint}`;
        expect(fetch).toBeCalledWith(expectedUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });
        expect(response).toEqual(expectedResponse);
    });

    test("get should send GET request baseUrl including endpoint and queries.", async () => {
        // fetch APIをモックする。
        const expectedResponse = {
            result: "test",
        };
        global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(200, "OK", JSON.stringify(expectedResponse)));

        // GETリクエストを送信する。
        const endpoint = "/test";
        const baseUrlIncludingEndpointAndQueries = `${baseUrl}${endpoint}?foo=bar&baz=123`;
        const httpClientWithBaseUrlIncludingEndpointAndQueries = new HttpClient(baseUrlIncludingEndpointAndQueries, accessToken);
        const response = await httpClientWithBaseUrlIncludingEndpointAndQueries.get();

        // 結果を検証する。
        const expectedUrl = baseUrlIncludingEndpointAndQueries;
        expect(fetch).toBeCalledWith(expectedUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });
        expect(response).toEqual(expectedResponse);
    });

    test("get should throw HttpRequestError on non-200 response.", async () => {
        expect.assertions(1);

        // テストで使用するデータを定義する。
        const expectedStatus = 404;
        const expectedStatusText = "Not Found";
        const endpoint = "/test";
        const expectedUrl = `${baseUrl}${endpoint}`;
        try {
            // fetch APIをモックする。
            global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(expectedStatus, expectedStatusText, ""));

            // GETリクエストを送信してエラーを発生させる。
            await httpClient.get(endpoint);
        } catch (error) {
            // エラーを検証する。
            expect(error).toEqual(new HttpRequestError("GET", expectedUrl, expectedStatus, expectedStatusText));
        }
    });
});

describe("post", () => {
    test("post should send POST request with queries and body.", async () => {
        // fetch APIをモックする。
        const expectedResponse = {
            result: "test",
        };
        global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(200, "OK", JSON.stringify(expectedResponse)));

        // POSTリクエストを送信する。
        const endpoint = "/test";
        const queries = {
            foo: "query",
            baz: 123,
        };
        const body = {
            foo: "body",
            baz: 456,
        };
        const response = await httpClient.post(endpoint, queries, body);

        // 結果を検証する。
        expect(fetch).toBeCalledWith(`${baseUrl}${endpoint}?foo=query&baz=123`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });
        expect(response).toEqual(expectedResponse);
    });

    test("post should send POST request with queries without body.", async () => {
        // fetch APIをモックする。
        const expectedResponse = {
            result: "test",
        };
        global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(200, "OK", JSON.stringify(expectedResponse)));

        // POSTリクエストを送信する。
        const endpoint = "/test";
        const queries = {
            foo: "query",
            baz: 123,
        };
        const response = await httpClient.post(endpoint, queries);

        // 結果を検証する。
        expect(fetch).toBeCalledWith(`${baseUrl}${endpoint}?foo=query&baz=123`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });
        expect(response).toEqual(expectedResponse);
    });

    test("post should send POST request with body without queries.", async () => {
        // fetch APIをモックする。
        const expectedResponse = {
            result: "test",
        };
        global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(200, "OK", JSON.stringify(expectedResponse)));

        // POSTリクエストを送信する。
        const endpoint = "/test";
        const body = {
            foo: "body",
            baz: 456,
        };
        const response = await httpClient.post(endpoint, {}, body);

        // 結果を検証する。
        expect(fetch).toBeCalledWith(`${baseUrl}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });
        expect(response).toEqual(expectedResponse);
    });

    test("post should send POST request without queries and body.", async () => {
        // fetch APIをモックする。
        const expectedResponse = {
            result: "test",
        };
        global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(200, "OK", JSON.stringify(expectedResponse)));

        // POSTリクエストを送信する。
        const endpoint = "/test";
        const response = await httpClient.post(endpoint);

        // 結果を検証する。
        expect(fetch).toBeCalledWith(`${baseUrl}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });
        expect(response).toEqual(expectedResponse);
    });

    test("post should send POST request baseUrl including endpoint and queries.", async () => {
        // fetch APIをモックする。
        const expectedResponse = {
            result: "test",
        };
        global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(200, "OK", JSON.stringify(expectedResponse)));

        // POSTリクエストを送信する。
        const endpoint = "/test";
        const body = {
            foo: "body",
            baz: 456,
        };
        const baseUrlIncludingEndpoint = `${baseUrl}${endpoint}?foo=query&baz=123`;
        const httpClientWithBaseUrlIncludingEndpoint = new HttpClient(baseUrlIncludingEndpoint, accessToken);
        const response = await httpClientWithBaseUrlIncludingEndpoint.post("", {}, body);

        // 結果を検証する。
        const expectedUrl = baseUrlIncludingEndpoint;
        expect(fetch).toBeCalledWith(expectedUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });
        expect(response).toEqual(expectedResponse);
    });

    test("post should throw HttpRequestError on non-200 response.", async () => {
        expect.assertions(1);

        // テストで使用するデータを定義する。
        const expectedStatus = 404;
        const expectedStatusText = "Not Found";
        const endpoint = "/test";
        const expectedUrl = `${baseUrl}${endpoint}`;
        try {
            // fetch APIをモックする。
            global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(expectedStatus, expectedStatusText, ""));

            // POSTリクエストを送信してエラーを発生させる。
            await httpClient.post(endpoint);
        } catch (error) {
            // エラーを検証する。
            expect(error).toEqual(new HttpRequestError("POST", expectedUrl, expectedStatus, expectedStatusText));
        }
    });
});

describe("put", () => {
    test("put should send POST request with queries and body.", async () => {
        // fetch APIをモックする。
        const expectedResponse = {
            result: "test",
        };
        global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(200, "OK", JSON.stringify(expectedResponse)));

        // PUTリクエストを送信する。
        const endpoint = "/test";
        const queries = {
            foo: "query",
            baz: 123,
        };
        const body = {
            foo: "body",
            baz: 456,
        };
        const response = await httpClient.put(endpoint, queries, body);

        // 結果を検証する。
        expect(fetch).toBeCalledWith(`${baseUrl}${endpoint}?foo=query&baz=123`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });
        expect(response).toEqual(expectedResponse);
    });

    test("put should send POST request with queries without body.", async () => {
        // fetch APIをモックする。
        const expectedResponse = {
            result: "test",
        };
        global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(200, "OK", JSON.stringify(expectedResponse)));

        // PUTリクエストを送信する。
        const endpoint = "/test";
        const queries = {
            foo: "query",
            baz: 123,
        };
        const response = await httpClient.put(endpoint, queries);

        // 結果を検証する。
        expect(fetch).toBeCalledWith(`${baseUrl}${endpoint}?foo=query&baz=123`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });
        expect(response).toEqual(expectedResponse);
    });

    test("put should send POST request with body without queries.", async () => {
        // fetch APIをモックする。
        const expectedResponse = {
            result: "test",
        };
        global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(200, "OK", JSON.stringify(expectedResponse)));

        // PUTリクエストを送信する。
        const endpoint = "/test";
        const body = {
            foo: "body",
            baz: 456,
        };
        const response = await httpClient.put(endpoint, {}, body);

        // 結果を検証する。
        expect(fetch).toBeCalledWith(`${baseUrl}${endpoint}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });
        expect(response).toEqual(expectedResponse);
    });

    test("put should send POST request without queries and body.", async () => {
        // fetch APIをモックする。
        const expectedResponse = {
            result: "test",
        };
        global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(200, "OK", JSON.stringify(expectedResponse)));

        // PUTリクエストを送信する。
        const endpoint = "/test";
        const response = await httpClient.put(endpoint);

        // 結果を検証する。
        expect(fetch).toBeCalledWith(`${baseUrl}${endpoint}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });
        expect(response).toEqual(expectedResponse);
    });

    test("put should send POST request baseUrl including endpoint and queries.", async () => {
        // fetch APIをモックする。
        const expectedResponse = {
            result: "test",
        };
        global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(200, "OK", JSON.stringify(expectedResponse)));

        // PUTリクエストを送信する。
        const endpoint = "/test";
        const body = {
            foo: "body",
            baz: 456,
        };
        const baseUrlIncludingEndpoint = `${baseUrl}${endpoint}?foo=query&baz=123`;
        const httpClientWithBaseUrlIncludingEndpoint = new HttpClient(baseUrlIncludingEndpoint, accessToken);
        const response = await httpClientWithBaseUrlIncludingEndpoint.put("", {}, body);

        // 結果を検証する。
        const expectedUrl = baseUrlIncludingEndpoint;
        expect(fetch).toBeCalledWith(expectedUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });
        expect(response).toEqual(expectedResponse);
    });

    test("put should throw HttpRequestError on non-200 response.", async () => {
        expect.assertions(1);

        // テストで使用するデータを定義する。
        const expectedStatus = 404;
        const expectedStatusText = "Not Found";
        const endpoint = "/test";
        const expectedUrl = `${baseUrl}${endpoint}`;
        try {
            // fetch APIをモックする。
            global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(expectedStatus, expectedStatusText, ""));

            // PUTリクエストを送信してエラーを発生させる。
            await httpClient.put(endpoint);
        } catch (error) {
            // エラーを検証する。
            expect(error).toEqual(new HttpRequestError("PUT", expectedUrl, expectedStatus, expectedStatusText));
        }
    });
});

describe("delete", () => {
    test("delete should send DELETE request.", async () => {
        // fetch APIをモックする。
        const expectedResponse = {
            result: "test",
        }
        global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(200, "OK", JSON.stringify(expectedResponse)));

        // DELETEリクエストを送信する。
        const endpoint = "/test";
        const expectedUrl = `${baseUrl}${endpoint}`;
        const response = await httpClient.delete(endpoint);

        // 結果を検証する。
        expect(fetch).toBeCalledWith(expectedUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });
        expect(response).toEqual(expectedResponse);
    });

    test("delete should send DELETE request baseUrl including endpoint.", async () => {
        // fetch APIをモックする。
        const expectedResponse = {
            result: "test",
        };
        global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(200, "OK", JSON.stringify(expectedResponse)));

        // DELETEリクエストを送信する。
        const endpoint = "/test";
        const baseUrlIncludingEndpoint = `${baseUrl}${endpoint}`;
        const httpClientWithBaseUrlIncludingEndpoint = new HttpClient(baseUrlIncludingEndpoint, accessToken);
        const response = await httpClientWithBaseUrlIncludingEndpoint.delete();

        // 結果を検証する。
        const expectedUrl = baseUrlIncludingEndpoint;
        expect(fetch).toBeCalledWith(expectedUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });
        expect(response).toEqual(expectedResponse);
    });

    test("delete should throw HttpRequestError on non-200 response.", async () => {
        expect.assertions(1);

        // テストで使用するデータを定義する。
        const expectedStatus = 404;
        const expectedStatusText = "Not Found";
        const endpoint = "/test";
        const expectedUrl = `${baseUrl}${endpoint}`;
        try {
            // fetch APIをモックする。
            global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(expectedStatus, expectedStatusText, ""));

            // POSTリクエストを送信してエラーを発生させる。
            await httpClient.delete(endpoint);
        } catch (error) {
            // エラーを検証する。
            expect(error).toEqual(new HttpRequestError("DELETE", expectedUrl, expectedStatus, expectedStatusText));
        }
    });
});

describe("requestText", () => {
    test("requestText should send request and return text response.", async () => {
        // fetch APIをモックする。
        const expectedResponse = "test";
        global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(200, "OK", expectedResponse));

        // プレーンテキストを取得するリクエストを送信する。
        const method = "POST";
        const endpoint = "/test";
        const body = {
            foo: "body",
            baz: 456,
        };
        const response = await httpClient.requestText(method, endpoint, body);

        // 結果を検証する。
        expect(fetch).toBeCalledWith(`${baseUrl}${endpoint}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });
        expect(response).toEqual(expectedResponse);
    });

    test("requestText should send POST request with endpoint included in baseUrl and return text response.", async () => {
        // fetch APIをモックする。
        const expectedResponse = "test";
        global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(200, "OK", expectedResponse));

        // プレーンテキストを取得するリクエストを送信する。
        const method = "POST";
        const endpoint = "/test";
        const baseUrlIncludingEndpoint = `${baseUrl}${endpoint}`;
        const body = {
            foo: "body",
            baz: 456,
        };
        const httpClientWithBaseUrlIncludingEndpoint = new HttpClient(baseUrlIncludingEndpoint, accessToken);
        const response = await httpClientWithBaseUrlIncludingEndpoint.requestText(method, "", body);

        // 結果を検証する。
        const expectedUrl = baseUrlIncludingEndpoint;
        expect(fetch).toBeCalledWith(expectedUrl, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });
        expect(response).toEqual(expectedResponse);
    });

    test("requestText should throw HttpRequestError on non-200 response.", async () => {
        expect.assertions(1);

        // テストで使用するデータを定義する。
        const expectedStatus = 404;
        const expectedStatusText = "Not Found";
        const method = "POST";
        const endpoint = "/test";
        const expectedUrl = `${baseUrl}${endpoint}`;
        try {
            // fetch APIをモックする。
            global.fetch = jest.fn<() => Promise<Response>>().mockResolvedValue(mockResponse(expectedStatus, expectedStatusText, ""));

            // POSTリクエストを送信してエラーを発生させる。
            await httpClient.requestText(method, endpoint);
        } catch (error) {
            // エラーを検証する。
            expect(error).toEqual(new HttpRequestError("POST", expectedUrl, expectedStatus, expectedStatusText));
        }
    });
});