import { AppLoadContext } from "@remix-run/node";
import AuthenticatedUserLoader from "../../app/loaders/user/authenticated-user-loader";
import UserAuthenticationAction from "../../app/actions/authentication/user-authentication-action";
import UserRegistrationAction from "../../app/actions/authentication/user-registration-action";
import MockAuthenticationClient from "../libraries/authentication/mock-authentication-client";
import UserAccountManager from "../../app/libraries/authentication/user-account-manager";
import AuthenticatedUserProvider from "../../app/libraries/user/authenticated-user-provider";
import LatestPostsLoader from "../../app/loaders/post/latest-posts-loader";
import PostLoader from "../../app/loaders/post/post-loader";
import RepliesLoader from "../../app/loaders/post/replies-loader";
import ReplyLoader from "../../app/loaders/post/reply-loader";
import SnsUserRegistrationAction from "../../app/actions/user/sns-user-registration-action";
import UserProfileManager from "../../app/libraries/user/user-profile-manager";
import MockUserRepository from "../repositories/user/mock-user-repository";
import MockReleaseInformationRepository from "../repositories/post/mock-release-information-repository";
import ReleaseInformationGetter from "../../app/libraries/post/release-information-getter";
import ReleaseInformationLoader from "../../app/loaders/post/release-information-loader";
import MockPostContentRepository from "../repositories/post/mock-post-content-repository";
import MockReplyContentRepository from "../repositories/post/mock-reply-content-repository";
import PostInteractor from "../../app/libraries/post/post-interactor";
import PostMessageAction from "../../app/actions/post/post-message-action";
import ReplyMessageAction from "../../app/actions/post/reply-message-action";
import PostsFetcher from "../../app/libraries/post/posts-fetcher";
import PostFetcher from "../../app/libraries/post/post-fetcher";
import RepliesFetcher from "../../app/libraries/post/replies-fetcher";
import ReplyFetcher from "../../app/libraries/post/reply-fetcher";
import UserSettingAction from "../../app/actions/user/user-setting-action";
import UserSettingLoader from "../../app/loaders/user/user-setting-loader";

// ユーザー登録を行うためのクラスを生成する。
const authenticationClient = new MockAuthenticationClient();
const userAccountManager: UserAccountManager = new UserAccountManager(authenticationClient);
const userRegistrationAction = new UserRegistrationAction(userAccountManager);
const userRepository = new MockUserRepository();
const userProfileManager = new UserProfileManager(userRepository);
const snsUserRegistrationAction = new SnsUserRegistrationAction(userProfileManager);

// ユーザー認証を行うためのクラスを生成する。
const userAuthenticationAction = new UserAuthenticationAction(userAccountManager);

// ユーザー設定を行うためのクラスを生成する。
const userSettingAction = new UserSettingAction(userProfileManager);

// ユーザー情報を取得するためのクラスを生成する。
const authenticatedUserProvider = new AuthenticatedUserProvider(authenticationClient, userRepository);
const authenticatedUserLoader = new AuthenticatedUserLoader(authenticatedUserProvider);

// ユーザー設定を取得するためのクラスを生成する。
const userSettingLoader = new UserSettingLoader(userProfileManager);

// メッセージを投稿するためのクラスを生成する。
const postContentRepository = new MockPostContentRepository();
const replyContentRepository = new MockReplyContentRepository();
const postInteractor = new PostInteractor(postContentRepository, replyContentRepository);
const postMessageAction = new PostMessageAction(postInteractor);
const replyMessageAction = new ReplyMessageAction(postInteractor);

// 最新の投稿を取得するためのクラスを生成する。
const postsFetcher = new PostsFetcher(postContentRepository);
const latestPostsLoader = new LatestPostsLoader(postsFetcher);
const postFetcher = new PostFetcher(postContentRepository);
const postLoader = new PostLoader(postFetcher);
const repliesFetcher = new RepliesFetcher(replyContentRepository);
const repliesLoader = new RepliesLoader(repliesFetcher);
const replyFetcher = new ReplyFetcher(replyContentRepository);
const replyLoader = new ReplyLoader(replyFetcher);

// リリース情報を取得するためのクラスを生成する。
const releaseInformationRepository = new MockReleaseInformationRepository();
const releaseInformationGetter = new ReleaseInformationGetter(releaseInformationRepository);
const releaseInformationLoader = new ReleaseInformationLoader(releaseInformationGetter);

export const unitTestAppLoadContext: AppLoadContext = {
    userRegistrationAction,
    snsUserRegistrationAction,
    userAuthenticationAction,
    userSettingAction,
    authenticatedUserLoader,
    userSettingLoader,
    latestPostsLoader,
    postLoader,
    repliesLoader,
    replyLoader,
    releaseInformationLoader,
    postMessageAction,
    replyMessageAction,
};