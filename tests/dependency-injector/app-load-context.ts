import { AppLoadContext } from "@netlify/remix-runtime";
import FF14SnsUserLoader from "../../app/loaders/user/ff14-sns-user-loader";
import UserAuthenticationAction from "../../app/actions/authentication/user-authentication-action";
import UserRegistrationAction from "../../app/actions/authentication/user-registration-action";
import MockAuthenticationClient from "../libraries/authentication/mock-authentication-client";
import UserAccountManager from "../../app/libraries/authentication/user-account-manager";
import AuthenticatedUserProvider from "../../app/libraries/user/authenticated-user-provider";
import LatestPostsLoader from "../../app/loaders/post/latest-posts-loader";

// ユーザー登録を行うためのクラスを生成する。
const mockauthenticationClient = new MockAuthenticationClient();
const userAccountManager: UserAccountManager = new UserAccountManager(mockauthenticationClient);
const userRegistrationAction = new UserRegistrationAction(userAccountManager);

// ユーザー認証を行うためのクラスを生成する。
const userAuthenticationAction = new UserAuthenticationAction(userAccountManager);

// ユーザー情報を取得するためのクラスを生成する。
const authenticatedUserProvider = new AuthenticatedUserProvider(mockauthenticationClient);
const ff14SnsUserLoader = new FF14SnsUserLoader(authenticatedUserProvider);

// 最新の投稿を取得するためのクラスを生成する。
const latestPostsLoader = new LatestPostsLoader();

const appLoadContext: AppLoadContext = {
    userRegistrationAction,
    userAuthenticationAction,
    ff14SnsUserLoader,
    latestPostsLoader,
};
export default appLoadContext;