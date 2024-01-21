import { AppLoadContext } from "@netlify/remix-runtime";
import AuthenticatedUserLoader from "../../app/loaders/user/authenticated-user-loader";
import UserAuthenticationAction from "../../app/actions/authentication/user-authentication-action";
import UserRegistrationAction from "../../app/actions/authentication/user-registration-action";
import MockAuthenticationClient from "../libraries/authentication/mock-authentication-client";
import UserAccountManager from "../../app/libraries/authentication/user-account-manager";
import AuthenticatedUserProvider from "../../app/libraries/user/authenticated-user-provider";
import LatestPostsLoader from "../../app/loaders/post/latest-posts-loader";
import SnsUserRegistrationAction from "../../app/actions/user/sns-user-registration-action";
import UserRegistrar from "../../app/libraries/user/user-registrar";
import MockUserRepository from "../repositories/user/mock-user-repository";
import MockReleaseInformationRepository from "../repositories/post/mock-release-information-repository";
import ReleaseInformationGetter from "../../app/libraries/post/release-information-getter";
import ReleaseInformationLoader from "../../app/loaders/post/release-information-loader";
import MockPostContentRepository from "../repositories/post/mock-post-content-repository";
import PostInteractor from "../../app/libraries/post/post-interactor";
import PostMessageAction from "../../app/actions/post/post-message-action";
import PostsFetcher from "../../app/libraries/post/posts-fetcher";

// ユーザー登録を行うためのクラスを生成する。
const authenticationClient = new MockAuthenticationClient();
const userAccountManager: UserAccountManager = new UserAccountManager(authenticationClient);
const userRegistrationAction = new UserRegistrationAction(userAccountManager);
const userRepository = new MockUserRepository();
const userRegistrar = new UserRegistrar(userRepository);
const snsUserRegistrationAction = new SnsUserRegistrationAction(userRegistrar);

// ユーザー認証を行うためのクラスを生成する。
const userAuthenticationAction = new UserAuthenticationAction(userAccountManager);

// ユーザー情報を取得するためのクラスを生成する。
const authenticatedUserProvider = new AuthenticatedUserProvider(authenticationClient, userRepository);
const authenticatedUserLoader = new AuthenticatedUserLoader(authenticatedUserProvider);

// メッセージを投稿するためのクラスを生成する。
const postContentRepository = new MockPostContentRepository();
const postInteractor = new PostInteractor(postContentRepository);
const postMessageAction = new PostMessageAction(postInteractor);

// 最新の投稿を取得するためのクラスを生成する。
const postsFetcher = new PostsFetcher(postContentRepository);
const latestPostsLoader = new LatestPostsLoader(postsFetcher);

// リリース情報を取得するためのクラスを生成する。
const releaseInformationRepository = new MockReleaseInformationRepository();
const releaseInformationGetter = new ReleaseInformationGetter(releaseInformationRepository);
const releaseInformationLoader = new ReleaseInformationLoader(releaseInformationGetter);

const appLoadContext: AppLoadContext = {
    userRegistrationAction,
    snsUserRegistrationAction,
    userAuthenticationAction,
    authenticatedUserLoader,
    latestPostsLoader,
    releaseInformationLoader,
    postMessageAction,
};
export default appLoadContext;