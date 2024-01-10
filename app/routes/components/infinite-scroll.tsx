import { SerializeFrom } from "@netlify/remix-runtime";
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
    const [scrollPosition, setScrollPosition] = useState(0);
    const [clientHeight, setClientHeight] = useState(0);
    const updateScrollPosition = () => {
        setScrollPosition(window.scrollY);
        setClientHeight(window.innerHeight);
    }

    const [componentHeight, setComponentHeight] = useState<number | null>(null);
    const componentRef = useCallback((node: HTMLElement | null) => {
        if (node !== null) {
            setComponentHeight(node.getBoundingClientRect().height);
        }
    }, [contents.length]);

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

    const [shouldFetch, setShouldFetch] = useState(true);
    useEffect(() => {
        // データをフェッチするべきかどうかを判定する。
        if (!shouldFetch || !componentHeight) return;
        if (clientHeight + scrollPosition + 100 < componentHeight) return;
        if (fetcher.state === "loading") return;

        // データをフェッチする。
        const lastId = contents[contents.length - 1].id;
        fetcher.load(`${targetAddress}/${lastId}`);
        setShouldFetch(false);
    }, [scrollPosition, clientHeight, fetcher.state]);

    useEffect(() => {
        if (!fetcher.data) return;
        if (!Array.isArray(fetcher.data)) return;

        // データをフェッチするべきかどうかを判定する。
        if (fetcher.data.length === 0) {
            setShouldFetch(false);
            return;
        }

        // データを追加する。
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