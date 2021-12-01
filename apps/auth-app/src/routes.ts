export const SIGN_IN = 'SignIn';
export const SIGN_UP = 'SignUp';
export const SIGN_UP_USERNAME = 'SignUpUsername';
export const WELCOME = 'Welcome';
export const rootRoute = '/auth-app';
export const FEED_APP = 'Feed';
export const CUSTOMISE_PROFILE = 'Profile';
export const rootAKASHARoute = '/social-app';
export const rootProfileRoute = '/profile';

export default {
  [SIGN_IN]: `${rootRoute}/sign-in`,
  [SIGN_UP]: `${rootRoute}/sign-up`,
  [SIGN_UP_USERNAME]: `${rootRoute}/sign-up/username`,
  [WELCOME]: `${rootRoute}/welcome`,
  [FEED_APP]: `${rootAKASHARoute}/feed`,
  [CUSTOMISE_PROFILE]: `${rootProfileRoute}/my-profile?modal[name]=update-profile`,
};
