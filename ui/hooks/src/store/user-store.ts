import getSDK from '@akashaorg/awf-sdk';
import { AUTH_EVENTS, CurrentUser, WEB3_EVENTS } from '@akashaorg/typings/lib/sdk';
import type { IPluginsMap } from '@akashaorg/typings/lib/ui';
import type { IUserState, IUserStore } from '@akashaorg/typings/lib/ui/store';
import type { WritableDraft } from 'immer/dist/internal';
import { createStore, type WritableAtom } from 'jotai';
import { atomWithImmer } from 'jotai-immer';
import { filter } from 'rxjs/operators';

const store = createStore();

const INITIAL_STATE: IUserState = {
  authenticatedDID: null,
  authenticatedProfile: null,
  authenticatedProfileError: null,
  isAuthenticating: false,
  authenticationError: null,
  isLoadingInfo: false,
  info: null,
  infoError: null,
};

const userAtom: WritableAtom<
  IUserState,
  [IUserState | ((draft: WritableDraft<IUserState>) => IUserState)],
  void
> = atomWithImmer<IUserState>(INITIAL_STATE);

export class UserStore implements IUserStore {
  private sdk = getSDK();
  private static instance: UserStore;
  private plugins: Record<string, IPluginsMap>;
  private constructor(plugins: Record<string, IPluginsMap>) {
    this.plugins = plugins;
    this.restoreSession();
    this.handleSignInEvent();
    this.handleLogoutEvent();
  }

  static getInstance(plugins: Record<string, IPluginsMap>): UserStore {
    if (!UserStore.instance) {
      UserStore.instance = new UserStore(plugins);
    }
    return UserStore.instance;
  }

  login({ provider, checkRegistered = false }) {
    try {
      store.set(userAtom, prev => ({
        ...prev,
        isAuthenticating: true,
      }));
      this.sdk.api.auth.signIn({
        provider,
        checkRegistered,
      });
    } catch (error) {
      store.set(userAtom, prev => ({
        ...prev,
        authenticationError: error,
        isAuthenticating: false,
      }));
    }
  }

  logout() {
    this.sdk.api.auth.signOut();
    store.set(userAtom, () => INITIAL_STATE);
  }

  private getProfileInfo(profileDid: string, appName = '@akashaorg/app-profile') {
    const getProfileInfo = this.plugins?.[appName]?.profile?.getProfileInfo;
    if (getProfileInfo) {
      return getProfileInfo(profileDid);
    }
    return null;
  }

  async getUserInfo(profileDid: string, appName = '@akashaorg/app-profile') {
    store.set(userAtom, prev => ({
      ...prev,
      isLoadingInfo: true,
    }));
    try {
      const profileInfo = await this.getProfileInfo(profileDid, appName);
      const state = store.get(userAtom);
      store.set(userAtom, prev => ({
        ...prev,
        /*@Todo: handle info for different profile apps */
        info: state.info.set(profileDid, profileInfo),
        isLoadingInfo: false,
      }));
    } catch (error) {
      store.set(userAtom, prev => ({
        ...prev,
        infoError: error,
        isLoadingInfo: false,
      }));
    }
  }

  handleLogoutEvent() {
    this.sdk.api.globalChannel
      .pipe(
        filter(payload => {
          return payload.event === WEB3_EVENTS.DISCONNECTED;
        }),
      )
      .subscribe({
        next: () => {
          store.set(userAtom, () => INITIAL_STATE);
        },
      });
  }

  handleSignInEvent() {
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
              profileInfo = await this.getProfileInfo(authenticatedDID);
            } catch (error) {
              authenticatedProfileError = error;
            }
            store.set(userAtom, prev => ({
              ...prev,
              authenticatedDID,
              authenticatedProfile: profileInfo,
              authenticatedProfileError,
              isAuthenticating: false,
            }));
          }
        },
      });
  }

  restoreSession() {
    try {
      store.set(userAtom, prev => ({
        ...prev,
        isAuthenticating: true,
      }));
      this.sdk.api.auth.getCurrentUser();
    } catch (error) {
      store.set(userAtom, prev => ({
        ...prev,
        authenticationError: error,
        isAuthenticating: false,
      }));
    }
  }

  subscribe(listener: () => void) {
    const subscription = store.sub(userAtom, listener);
    return () => subscription();
  }

  getSnapshot() {
    return store.get(userAtom);
  }
}
