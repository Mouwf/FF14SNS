import LatestPostsLoader from "../app/loaders/post/latest-posts-loader";
import UserAuthenticationAction from "../app/actions/authentication/user-authentication-action";
import UserRegistrationAction from "../app/actions/authentication/user-registration-action";
import FF14SnsUserLoader from "../app/loaders/user/ff14-sns-user-loader";

declare module '@netlify/remix-runtime' {
    export interface AppLoadContext {
        userRegistrationAction: UserRegistrationAction;
        userAuthenticationAction: UserAuthenticationAction;
        ff14SnsUserLoader: FF14SnsUserLoader;
        latestPostsLoader: LatestPostsLoader;
    }
}