import type * as express from "express";
import { AppLoadContext } from "@netlify/remix-runtime";
import AuthenticatedUserProvider from "../libraries/user/authenticated-user-provider";
import FF14SnsUserLoader from "../loaders/user/ff14-sns-user-loader";
import UserAccountManager from "../libraries/authentication/user-account-manager";
import UserAuthenticationAction from "../actions/authentication/user-authentication-action";
import IUserAuthenticator from "../libraries/authentication/i-user-authenticator";
import UserRegistrationAction from "../actions/authentication/user-registration-action";
import IUserRegistrar from "../libraries/authentication/i-user-registrar";
import LatestPostsLoader from "../loaders/post/latest-posts-loader";
import FirebaseClient from "../libraries/authentication/firebase-client";

// ユーザー登録を行うためのクラスを生成する。
const authenticationClient = new FirebaseClient();
const userAccountManager = new UserAccountManager(authenticationClient);
const userRegistrar: IUserRegistrar = userAccountManager;
const userRegistrationAction = new UserRegistrationAction(userRegistrar);

// ユーザー認証を行うためのクラスを生成する。
const userAuthenticator: IUserAuthenticator = userAccountManager;
const userAuthenticationAction = new UserAuthenticationAction(userAuthenticator);

// ユーザー情報を取得するためのクラスを生成する。
const authenticatedUserProvider = new AuthenticatedUserProvider(authenticationClient);
const ff14SnsUserLoader = new FF14SnsUserLoader(authenticatedUserProvider);

// 最新の投稿を取得するためのクラスを生成する。
const latestPostsLoader = new LatestPostsLoader();

export const appLoadContext: AppLoadContext = {
    userRegistrationAction,
    userAuthenticationAction,
    ff14SnsUserLoader,
    latestPostsLoader,
};

/**
 * ローダー、アクションなどのコンテキストを取得する。
 * @param request リクエスト。
 * @param context コンテキスト。
 * @returns ローダー、アクションなどのコンテキスト。
 */
export default function getLoadContext(req: express.Request, res: express.Response) {
    return { ...appLoadContext };
}