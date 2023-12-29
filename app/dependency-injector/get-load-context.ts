import type * as express from "express";
import { AppLoadContext } from "@netlify/remix-runtime";
import FirebaseAuthenticatedUserProvider from "../libraries/user/firebase-authenticated-user-provider";
import FF14SnsUserLoader from "../loaders/user/ff14-sns-user-loader";
import FirebaseUserAccountManager from "../libraries/authentication/firebase-user-account-manager";
import UserAuthenticationAction from "../actions/authentication/user-authentication-action";
import IUserAuthenticator from "../libraries/authentication/i-user-authenticator";
import UserRegistrationAction from "../actions/authentication/user-registration-action";
import IUserRegistrar from "../libraries/authentication/i-user-registrar";

// ユーザー登録を行うためのクラスを生成する。
const userAccountManager = new FirebaseUserAccountManager();
const userRegistrar: IUserRegistrar = userAccountManager;
const userRegistrationAction = new UserRegistrationAction(userRegistrar);

// ユーザー認証を行うためのクラスを生成する。
const userAuthenticator: IUserAuthenticator = userAccountManager;
const userAuthenticationAction = new UserAuthenticationAction(userAuthenticator);

// ユーザー情報を取得するためのクラスを生成する。
const authenticatedUserProvider = new FirebaseAuthenticatedUserProvider();
const ff14SnsUserLoader = new FF14SnsUserLoader(authenticatedUserProvider);

/**
 * ローダー、アクションなどのコンテキストを取得する。
 * @param request リクエスト。
 * @param context コンテキスト。
 * @returns ローダー、アクションなどのコンテキスト。
 */
export default function getLoadContext(req: express.Request, res: express.Response) {
    const appLoadContext: AppLoadContext = {
        userRegistrationAction,
        userAuthenticationAction,
        ff14SnsUserLoader,
    };
    return { ...appLoadContext };
}