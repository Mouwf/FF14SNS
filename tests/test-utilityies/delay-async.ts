/**
 * 指定された関数を指定された秒数待機して実行する。
 * @param fn 指定された関数。
 * @param delayMs 待機時間。
 * @returns 関数の戻り値。
 */
export default async function delayAsync<T>(fn: () => Promise<T>, delayMs: number = 0): Promise<T> {
    await delay(delayMs);
    return await fn();
}

/**
 * 待機する。
 * @param ms 待機時間。
 */
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}