export enum AUTH_EVENTS {
  SIGN_IN = 'auth#signIn',
  READY = 'auth#ready',
  NEW_NOTIFICATIONS = 'auth#hasNewNotifications',
  SIGN_OUT = '#auth#signOut',
  WAIT_FOR_AUTH = 'auth#waitForAuth',
}

export enum PROFILE_EVENTS {
  FOLLOW = '#profile#Follow',
  UNFOLLOW = '#profile#UnFollow',
}
