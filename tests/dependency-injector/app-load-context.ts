import { AppLoadContext } from "@netlify/remix-runtime";
import FF14SnsUserLoader from "../../app/loaders/user/ff14-sns-user-loader";
import UserAuthenticationAction from "../../app/actions/authentication/user-authentication-action";
import UserRegistrationAction from "../../app/actions/authentication/user-registration-action";
import MockUserRegistrar from "../libraries/authentication/mock-user-registrar";
import MockUserAuthenticator from "../libraries/authentication/mock-user-authenticator";
import MockAuthenticatedUserProvider from "../libraries/user/mock-authenticated-user-provider";
import LatestPostsLoader from "../../app/loaders/post/latest-posts-loader";

// ユーザー登録を行うためのクラスを生成する。
const userRegistrar = new MockUserRegistrar();
const userRegistrationAction = new UserRegistrationAction(userRegistrar);

// ユーザー認証を行うためのクラスを生成する。
const userAuthenticator = new MockUserAuthenticator();
const userAuthenticationAction = new UserAuthenticationAction(userAuthenticator);

// ユーザー情報を取得するためのクラスを生成する。
const authenticatedUserProvider = new MockAuthenticatedUserProvider();
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