import { SerializeFrom } from "@remix-run/node";
import { FetcherWithComponents } from "@remix-run/react";
import { Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useState } from "react";
import Entity from "../../models/common/entity";

/**
 * 無限スクロール。
 * @param children 子要素。
 * @param fetcher フェッチャー。
 * @param targetAddress フェッチするアドレス。
 * @param contents 無限スクロールするコンテンツ。
 * @param setContents 無限スクロールするコンテンツを設定する関数。
 * @returns 無限スクロール。
 */
export default function InfiniteScroll<T extends Entity[]>({
    children,
    fetcher,
    targetAddress,
    contents,
    setContents,
}: {
    children: ReactNode,
    fetcher: FetcherWithComponents<SerializeFrom<T>>,
    targetAddress: string,
    contents: T,
    setContents: Dispatch<SetStateAction<T>>,
}) {
    // スクロールされた時、ブラウザの高さ、スクロール位置を更新する。
    const [clientHeight, setClientHeight] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const updateScrollPosition = () => {
        setClientHeight(window.innerHeight);
        setScrollPosition(window.scrollY);
    }
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("scroll", updateScrollPosition);
        }
        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("scroll", updateScrollPosition);
            }
        }
    }, []);

    // スクロールされた位置が一定値を超えた場合、データをフェッチする。
    const [shouldFetch, setShouldFetch] = useState(true);
    const [componentHeight, setComponentHeight] = useState<number | null>(null);
    const componentRef = useCallback((element: HTMLElement | null) => {
        if (element !== null) {
            setComponentHeight(element.getBoundingClientRect().height);
        }
    }, [contents.length]);
    const scrollFetchThreshold = 100;
    useEffect(() => {
        // データをフェッチするべきかどうかを判定する。
        if (!shouldFetch || !componentHeight) return;
        if (clientHeight + scrollPosition + scrollFetchThreshold < componentHeight) return;
        if (fetcher.state === "loading") return;

        // データをフェッチする。
        const lastId = contents[contents.length - 1].id;
        fetcher.load(`${targetAddress}/${lastId}`);
        setShouldFetch(false);
    }, [clientHeight, scrollPosition, fetcher.state]);

    // データを追加する。
    useEffect(() => {
        // データがない場合、処理を終了する。
        if (!fetcher.data) return;
        if (!Array.isArray(fetcher.data)) return;

        // フェッチしたデータがない場合、無限スクロールを終了する。
        if (fetcher.data.length === 0) {
            setShouldFetch(false);
            return;
        }

        // フェッチしたデータを追加する。
        const data = fetcher.data as T;
        if (data.length > 0) {
            setContents((prevContents: T) => [...prevContents, ...data] as T);
            setShouldFetch(true);
        }
    }, [fetcher.data]);

    return (
        <div ref={componentRef}>
            {children}
        </div>
    );
}