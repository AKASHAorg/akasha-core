export const SIGN_IN = 'SignIn';
export const SIGN_UP = 'SignUp';
export const SIGN_UP_USERNAME = 'SignUpUsername';
export const WELCOME = 'Welcome';
export const rootRoute = '/auth-app';
export const CUSTOMISE_PROFILE = 'Profile';
export const rootAKASHARoute = '/social-app';
export const rootProfileRoute = '/profile';

export default {
  [SIGN_IN]: `${rootRoute}/sign-in`,
  [SIGN_UP]: `${rootRoute}/sign-up`,
  [SIGN_UP_USERNAME]: `${rootRoute}/sign-up/username`,
  [WELCOME]: `${rootRoute}/welcome`,
};
