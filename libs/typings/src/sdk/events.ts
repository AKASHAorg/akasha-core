export enum AUTH_EVENTS {
  SIGN_IN = '#auth#signIn',
  READY = '#auth#ready',
  NEW_NOTIFICATIONS = '#auth#hasNewNotifications',
  NEW_MESSAGES = '#auth#hasNewMessages',
  SIGN_OUT = '#auth#signOut',
  WAIT_FOR_AUTH = '#auth#waitForAuth',
  MARK_MSG_READ = '#auth#markMsgRead',
  CONNECT_ADDRESS = '#auth#connectAddress',
  CONNECT_ADDRESS_SUCCESS = '#auth#connectAddress#success',
  SIGN_AUTH_MESSAGE = '#auth#signAuthMessage',
  SIGN_AUTH_MESSAGE_SUCCESS = '#auth#signAuthMessage#success',
  SIGN_COMPOSED_MESSAGE = '#auth#signComposedMessage',
  SIGN_COMPOSED_MESSAGE_SUCCESS = '#auth#signComposedMessage#success',
  SIGN_TOKEN_MESSAGE = '#auth#signTokenMessage',
  SIGN_TOKEN_MESSAGE_SUCCESS = '#auth#signTokenMessage#success',
}

export enum WEB3_EVENTS {
  CONNECTED = '#web3#connected',
  DISCONNECTED = '#web3#disconnected',
  ACCOUNT_CHANGED = '#web3#accountChanged',
  CHAIN_CHANGED = '#web3#chainChanged',
  WC_MODAL_CLOSED = '#web3#modalClosed',
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

export enum APP_EVENTS {
  INFO_READY = '#integration#ReleaseInfoReady',
  REMOVED = '#integration#Removed',
  TOGGLE_STATUS = '#integration#ToggleStatus',
  UPDATE_VERSION = '#integration#UpdateVersion',
  UPDATE_CONFIG = '#integration#UpdateConfig',
}

export enum GQL_EVENTS {
  MUTATION = 'gql#mutation#event'
}
