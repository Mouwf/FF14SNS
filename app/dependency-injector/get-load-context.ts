import type * as express from "express";
import { AppLoadContext } from "@netlify/remix-runtime";
import AuthenticatedUserProvider from "../libraries/user/authenticated-user-provider";
import AuthenticatedUserLoader from "../loaders/user/authenticated-user-loader";
import UserAccountManager from "../libraries/authentication/user-account-manager";
import UserAuthenticationAction from "../actions/authentication/user-authentication-action";
import IUserAuthenticator from "../libraries/authentication/i-user-authenticator";
import UserRegistrationAction from "../actions/authentication/user-registration-action";
import SnsUserRegistrationAction from "../actions/user/sns-user-registration-action";
import UserRegistrar from "../libraries/user/user-registrar";
import PostgresClientProvider from "../repositories/common/postgres-client-provider";
import PostgresUserRepository from "../repositories/user/postgres-user-repository";
import IAuthenticationUserRegistrar from "../libraries/authentication/i-authentication-user-registrar";
import LatestPostsLoader from "../loaders/post/latest-posts-loader";
import FirebaseClient from "../libraries/authentication/firebase-client";

// ユーザー登録を行うためのクラスを生成する。
const authenticationClient = new FirebaseClient();
const userAccountManager = new UserAccountManager(authenticationClient);
const authenticationUserRegistrar: IAuthenticationUserRegistrar = userAccountManager;
const userRegistrationAction = new UserRegistrationAction(authenticationUserRegistrar);
export const postgresClientProvider = new PostgresClientProvider();
const userRepository = new PostgresUserRepository(postgresClientProvider);
const userRegistrar = new UserRegistrar(userRepository);
const snsUserRegistrationAction = new SnsUserRegistrationAction(userRegistrar);

// ユーザー認証を行うためのクラスを生成する。
const userAuthenticator: IUserAuthenticator = userAccountManager;
const userAuthenticationAction = new UserAuthenticationAction(userAuthenticator);

// ユーザー情報を取得するためのクラスを生成する。
const authenticatedUserProvider = new AuthenticatedUserProvider(authenticationClient, userRepository);
const authenticatedUserLoader = new AuthenticatedUserLoader(authenticatedUserProvider);

// 最新の投稿を取得するためのクラスを生成する。
const latestPostsLoader = new LatestPostsLoader();

export const appLoadContext: AppLoadContext = {
    userRegistrationAction,
    snsUserRegistrationAction,
    userAuthenticationAction,
    authenticatedUserLoader,
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