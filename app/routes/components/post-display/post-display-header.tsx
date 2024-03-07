import styles from "./post-display-header.module.css";

/**
 * 投稿表示のヘッダー。
 * @param posterName 投稿者名。
 * @param releaseVersion 投稿に関連するリリースバージョン。
 * @param releaseName 投稿に関連するリリース名。
 * @returns 
 */
export default function PostDisplayHeader({
    posterName,
    releaseVersion,
    releaseName,
    createdAt,
}: {
    posterName: string;
    releaseVersion: string;
    releaseName: string;
    createdAt: Date;
}) {
    const getPostTime = () => {
        const postDate = createdAt;
        const formattedDate = postDate.toLocaleString("ja-JP", {
            timeZone: "Asia/Tokyo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });

        return (
            <time className={styles["post-date"]}>{formattedDate}</time>
        );
    }

    return (
        <div className={styles["post-information-container"]}>
            <div className={styles["post-information"]}>
                <p className={styles["post-user-name"]}>{posterName}</p>
                <div>
                    <span className={styles["post-release-version"]}>{`${releaseVersion} ${releaseName}`}</span>
                </div>
            </div>
            <div>
                {getPostTime()}
            </div>
        </div>
    );
}