import styles from "./post-user-profile-image.module.css";

/**
 * 投稿ユーザープロフィール画像。
 * @returns 投稿ユーザープロフィール画像。
 */
export default function PostUserProfileImage() {
    return (
        <div className={styles["post-user-img-area"]}>
            <img src="/images/dummy-profile.png" width="57px" height="57px" alt="プロフィール ダミー" />
        </div>
    );
}