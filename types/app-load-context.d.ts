import LatestPostsLoader from "../app/loaders/post/latest-posts-loader";
import UserAuthenticationAction from "../app/actions/authentication/user-authentication-action";
import UserRegistrationAction from "../app/actions/authentication/user-registration-action";
import AuthenticatedUserLoader from "../app/loaders/user/authenticated-user-loader";
import SnsUserRegistrationAction from "../app/actions/user/sns-user-registration-action";
import ReleaseInformationLoader from "../app/loaders/post/release-information-loader";
import PostMessageAction from "../app/actions/post/post-message-action";

declare module '@netlify/remix-runtime' {
    export interface AppLoadContext {
        userRegistrationAction: UserRegistrationAction;
        snsUserRegistrationAction: SnsUserRegistrationAction;
        userAuthenticationAction: UserAuthenticationAction;
        authenticatedUserLoader: AuthenticatedUserLoader;
        latestPostsLoader: LatestPostsLoader;
        releaseInformationLoader: ReleaseInformationLoader;
        postMessageAction: PostMessageAction;
    }
}