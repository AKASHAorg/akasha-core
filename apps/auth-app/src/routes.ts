export const SIGN_IN = 'SignIn';
export const SIGN_UP = 'SignUp';
export const rootRoute = '/auth-app';

export default {
  [SIGN_IN]: `${rootRoute}/sign-in`,
  [SIGN_UP]: `${rootRoute}/sign-up`,
};
