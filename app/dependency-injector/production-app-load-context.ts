import { AppLoadContext } from "@remix-run/node";
import AuthenticatedUserProvider from "../libraries/user/authenticated-user-provider";
import AuthenticatedUserLoader from "../loaders/user/authenticated-user-loader";
import UserAccountManager from "../libraries/authentication/user-account-manager";
import UserAuthenticationAction from "../actions/authentication/user-authentication-action";
import UserRegistrationAction from "../actions/authentication/user-registration-action";
import SnsUserRegistrationAction from "../actions/user/sns-user-registration-action";
import UserProfileManager from "../libraries/user/user-profile-manager";
import PostgresClientProvider from "../repositories/common/postgres-client-provider";
import PostgresUserRepository from "../repositories/user/postgres-user-repository";
import LatestPostsLoader from "../loaders/post/latest-posts-loader";
import FirebaseClient from "../libraries/authentication/firebase-client";
import ReleaseInformationGetter from "../libraries/post/release-information-getter";
import ReleaseInformationLoader from "../loaders/post/release-information-loader";
import PostgresReleaseInformationRepository from "../repositories/post/postgres-release-information-repository";
import PostgresPostContentRepository from "../repositories/post/postgres-post-content-repository";
import PostInteractor from "../libraries/post/post-interactor";
import PostMessageAction from "../actions/post/post-message-action";
import PostsFetcher from "../libraries/post/posts-fetcher";
import UserSettingAction from "../actions/user/user-setting-action";
import UserSettingLoader from "../loaders/user/user-setting-loader";

// ユーザー登録を行うためのクラスを生成する。
const authenticationClient = new FirebaseClient();
const userAccountManager = new UserAccountManager(authenticationClient);
const userRegistrationAction = new UserRegistrationAction(userAccountManager);
export const postgresClientProvider = new PostgresClientProvider();
const userRepository = new PostgresUserRepository(postgresClientProvider);
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
const postContentRepository = new PostgresPostContentRepository(postgresClientProvider);
const postInteractor = new PostInteractor(postContentRepository);
const postMessageAction = new PostMessageAction(postInteractor);

// 最新の投稿を取得するためのクラスを生成する。
const postsFetcher = new PostsFetcher(postContentRepository);
const latestPostsLoader = new LatestPostsLoader(postsFetcher);

// リリース情報を取得するためのクラスを生成する。
const releaseInformationRepository = new PostgresReleaseInformationRepository(postgresClientProvider);
const releaseInformationGetter = new ReleaseInformationGetter(releaseInformationRepository);
const releaseInformationLoader = new ReleaseInformationLoader(releaseInformationGetter);

export const productionAppLoadContext: AppLoadContext = {
    userRegistrationAction,
    snsUserRegistrationAction,
    userAuthenticationAction,
    userSettingAction,
    authenticatedUserLoader,
    userSettingLoader,
    latestPostsLoader,
    releaseInformationLoader,
    postMessageAction,
};