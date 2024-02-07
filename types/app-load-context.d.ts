import LatestPostsLoader from "../app/loaders/post/latest-posts-loader";
import UserAuthenticationAction from "../app/actions/authentication/user-authentication-action";
import UserRegistrationAction from "../app/actions/authentication/user-registration-action";
import UserSettingAction from "../app/actions/user/user-setting-action";
import AuthenticatedUserLoader from "../app/loaders/user/authenticated-user-loader";
import SnsUserRegistrationAction from "../app/actions/user/sns-user-registration-action";
import ReleaseInformationLoader from "../app/loaders/post/release-information-loader";
import PostMessageAction from "../app/actions/post/post-message-action";
import UserSettingLoader from "../app/loaders/user/user-setting-loader";

declare module '@remix-run/node' {
    export interface AppLoadContext {
        userRegistrationAction: UserRegistrationAction;
        snsUserRegistrationAction: SnsUserRegistrationAction;
        userAuthenticationAction: UserAuthenticationAction;
        userSettingAction: UserSettingAction;
        authenticatedUserLoader: AuthenticatedUserLoader;
        userSettingLoader: UserSettingLoader;
        latestPostsLoader: LatestPostsLoader;
        releaseInformationLoader: ReleaseInformationLoader;
        postMessageAction: PostMessageAction;
    }
}