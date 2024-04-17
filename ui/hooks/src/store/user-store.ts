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
  authenticatedDid: null,
  isAuthenticating: false,
  authenticationError: null,
  isLoadingInfo: false,
  info: null,
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
    this.checkLogoutEvent();
    this.restoreSession();
  }

  static getInstance(plugins: Record<string, IPluginsMap>): UserStore {
    if (!UserStore.instance) {
      UserStore.instance = new UserStore(plugins);
    }
    return UserStore.instance;
  }

  async login({ provider, checkRegistered = false }) {
    try {
      store.set(userAtom, prev => ({
        ...prev,
        isAuthenticating: true,
      }));
      const resp = await this.sdk.api.auth.signIn({
        provider,
        checkRegistered,
      });
      if (resp.data) {
        store.set(userAtom, prev => ({
          ...prev,
          authenticatedDid: resp.data.id,
          isAuthenticating: false,
        }));
      }
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
    const profileInfo = await this.getProfileInfo(profileDid, appName);
    store.set(userAtom, prev => ({
      ...prev,
      info: profileInfo,
      isLoadingInfo: false,
    }));
  }

  checkLogoutEvent() {
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

  async restoreSession() {
    try {
      store.set(userAtom, prev => ({
        ...prev,
        isAuthenticating: true,
      }));
      await this.sdk.api.auth.getCurrentUser();
      this.sdk.api.globalChannel
        .pipe(
          filter(payload => {
            return payload.event === AUTH_EVENTS.SIGN_IN;
          }),
        )
        .subscribe({
          next: ({ data }: { data: CurrentUser }) => {
            store.set(userAtom, prev => ({
              ...prev,
              authenticatedDid: data.id,
              isAuthenticating: false,
            }));
          },
        });
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
