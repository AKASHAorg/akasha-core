import getSDK from '@akashaorg/awf-sdk';
import { AUTH_EVENTS, CurrentUser, WEB3_EVENTS } from '@akashaorg/typings/lib/sdk';
import type { IGetUserInfo, IUserState, IUserStore } from '@akashaorg/typings/lib/ui/store';
import { createStore } from 'jotai';
import { atomWithImmer } from 'jotai-immer';
import { filter } from 'rxjs/operators';

const store = createStore();

const INITIAL_STATE = {
  authenticatedDID: null,
  authenticatedProfile: null,
  authenticatedProfileError: null,
  isAuthenticating: false,
  authenticationError: null,
  isLoadingInfo: false,
  info: {},
  infoError: null,
};

type GetProfileInfo<T> = (props: IGetUserInfo) => Promise<T>;

export class UserStore<T> implements IUserStore<T> {
  private sdk = getSDK();
  private static instance = null;
  private getProfileInfo: GetProfileInfo<T>;
  private userAtom = atomWithImmer<IUserState<T>>(INITIAL_STATE);
  private constructor(getProfileInfo: GetProfileInfo<T>) {
    this.getProfileInfo = getProfileInfo;
    this.restoreSession();
    this.handleSignInEvent();
    this.handleLogoutEvent();
  }

  static getInstance<T>(getProfileInfo: GetProfileInfo<T>): UserStore<T> {
    if (!UserStore.instance) {
      UserStore.instance = new UserStore<T>(getProfileInfo);
    }
    return UserStore.instance;
  }

  login = ({ provider, checkRegistered = false }) => {
    try {
      store.set(this.userAtom, prev => ({
        ...prev,
        isAuthenticating: true,
      }));
      this.sdk.api.auth.signIn({
        provider,
        checkRegistered,
      });
    } catch (error) {
      store.set(this.userAtom, prev => ({
        ...prev,
        authenticationError: error,
        isAuthenticating: false,
      }));
    }
  };

  logout = () => {
    this.sdk.api.auth.signOut();
    store.set(this.userAtom, () => INITIAL_STATE);
  };

  getUserInfo = async ({ profileDid }: IGetUserInfo) => {
    store.set(this.userAtom, prev => ({
      ...prev,
      isLoadingInfo: true,
    }));
    try {
      const profileInfo = await this.getProfileInfo({ profileDid });
      const state = store.get(this.userAtom);
      store.set(this.userAtom, prev => ({
        ...prev,
        info: { ...state.info, [profileDid]: profileInfo },
        isLoadingInfo: false,
      }));
    } catch (error) {
      store.set(this.userAtom, prev => ({
        ...prev,
        infoError: error,
        isLoadingInfo: false,
      }));
    }
  };

  handleLogoutEvent = () => {
    this.sdk.api.globalChannel
      .pipe(
        filter(payload => {
          return payload.event === WEB3_EVENTS.DISCONNECTED;
        }),
      )
      .subscribe({
        next: () => {
          store.set(this.userAtom, () => INITIAL_STATE);
        },
      });
  };

  handleSignInEvent = () => {
    this.sdk.api.globalChannel
      .pipe(
        filter(payload => {
          return payload.event === AUTH_EVENTS.SIGN_IN;
        }),
      )
      .subscribe({
        next: async ({ data }: { data: CurrentUser }) => {
          const authenticatedDID = data.id;
          if (authenticatedDID) {
            let profileInfo = null;
            let authenticatedProfileError = null;
            try {
              profileInfo = await this.getProfileInfo({ profileDid: authenticatedDID });
            } catch (error) {
              authenticatedProfileError = error;
            }
            store.set(this.userAtom, prev => ({
              ...prev,
              authenticatedDID,
              authenticatedProfile: profileInfo,
              authenticatedProfileError,
              isAuthenticating: false,
            }));
          }
        },
      });
  };

  restoreSession = () => {
    try {
      store.set(this.userAtom, prev => ({
        ...prev,
        isAuthenticating: true,
      }));
      this.sdk.api.auth.getCurrentUser();
    } catch (error) {
      store.set(this.userAtom, prev => ({
        ...prev,
        authenticationError: error,
        isAuthenticating: false,
      }));
    }
  };

  subscribe = (listener: () => void) => {
    const subscription = store.sub(this.userAtom, listener);
    return () => subscription();
  };

  getSnapshot = () => {
    return store.get(this.userAtom);
  };
}
