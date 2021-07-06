export enum AUTH_EVENTS {
  SIGN_IN = '#auth#signIn',
  READY = '#auth#ready',
  NEW_NOTIFICATIONS = '#auth#hasNewNotifications',
  SIGN_OUT = '#auth#signOut',
  WAIT_FOR_AUTH = '#auth#waitForAuth',
  MARK_MSG_READ = '#auth#markMsgRead',
}

export enum PROFILE_EVENTS {
  FOLLOW = '#profile#Follow',
  UNFOLLOW = '#profile#UnFollow',
  ADD_PROVIDER = '#profile#AddProvider',
  DEFAULT_PROVIDER = '#profile#DefaultProvider',
  REGISTER_USERNAME = '#profile#RegisterUsername',
  TAG_SUBSCRIPTION = '#profile#TagSubscription',
}

export enum COMMENTS_EVENTS {
  CREATE = '#comments#Create',
  EDIT = '#comments#Edit',
  REMOVE = '#comments#Remove',
}

export enum ENTRY_EVENTS {
  CREATE = '#entries#Create',
  EDIT = '#entries#Edit',
  REMOVE = '#entries#Remove',
}

export enum TAG_EVENTS {
  CREATE = '#tags#Create',
}

export enum ENS_EVENTS {
  REGISTER = '#ens#Register',
  CLAIM = '#ens#Claim',
}
