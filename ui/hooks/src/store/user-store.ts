import getSDK from '@akashaorg/awf-sdk';
import { AUTH_EVENTS, CurrentUser, WEB3_EVENTS } from '@akashaorg/typings/lib/sdk';
import type { IGetProfileInfo, IUserState, IUserStore } from '@akashaorg/typings/lib/ui/store';
import { createStore } from 'jotai';
import { atomWithImmer } from 'jotai-immer';
import { filter } from 'rxjs/operators';

const store = createStore();

/**
 * Singleton store for managing login, logout, session restoration and fetching profile.
 * It uses jotai to manage the store
 */
export class UserStore<T> implements IUserStore<T> {
  #initialState: IUserState<T> = {
    authenticatedDID: null,
    authenticatedProfile: null,
    authenticatedProfileError: null,
    isAuthenticating: false,
    authenticationError: null,
  };
  #sdk = getSDK();
  static #instance = null;
  #getProfileInfo: IGetProfileInfo<T>['getProfileInfo'];
  #userAtom = atomWithImmer<IUserState<T>>(this.#initialState);

  /**
   * Prevent singleton store from being instantiated outside of this class
   */
  private constructor(getProfileInfo: IGetProfileInfo<T>['getProfileInfo']) {
    this.#getProfileInfo = getProfileInfo;
    this.restoreSession();
    this.handleLogInEvent();
    this.handleLogoutEvent();
  }

  /**
   * Get the singleton instance of the user store
   */
  static getInstance<T>(getProfileInfo: IGetProfileInfo<T>['getProfileInfo']): UserStore<T> {
    if (!UserStore.#instance) {
      UserStore.#instance = new UserStore<T>(getProfileInfo);
    }
    return UserStore.#instance;
  }

  /**
   * Handles login
   */
  login = ({ provider, checkRegistered = false }) => {
    try {
      store.set(this.#userAtom, prev => ({
        ...prev,
        isAuthenticating: true,
      }));
      this.#sdk.api.auth.signIn({
        provider,
        checkRegistered,
      });
    } catch (error) {
      store.set(this.#userAtom, prev => ({
        ...prev,
        authenticationError: error,
        isAuthenticating: false,
      }));
    }
  };

  /**
   * Handles logout
   */
  logout = () => {
    this.#sdk.api.auth.signOut();
    store.set(this.#userAtom, () => this.#initialState);
  };

  /**
   * Listens to a disconnected event and reset the store to the initial state
   */
  handleLogoutEvent = () => {
    this.#sdk.api.globalChannel
      .pipe(
        filter(payload => {
          return payload.event === WEB3_EVENTS.DISCONNECTED;
        }),
      )
      .subscribe({
        next: () => {
          store.set(this.#userAtom, () => this.#initialState);
        },
      });
  };

  /**
   * Listens to a sign in event on the global channel and set the authenticatedDID state
   * Fetch the authenticated profile info for the authenticatedDID and set the authenticatedProfile state
   */
  handleLogInEvent = () => {
    this.#sdk.api.globalChannel
      .pipe(
        filter(payload => {
          return payload.event === AUTH_EVENTS.SIGN_IN;
        }),
      )
      .subscribe({
        next: async ({ data }: { data: CurrentUser }) => {
          const authenticatedDID = data.id;
          if (authenticatedDID) {
            const { data: profileInfo, error } = await this.#getProfileInfo({
              profileDID: authenticatedDID,
            });
            store.set(this.#userAtom, prev => ({
              ...prev,
              authenticatedDID,
              authenticatedProfile: profileInfo,
              authenticatedProfileError: error,
              isAuthenticating: false,
            }));
          }
        },
        error: error => {
          store.set(this.#userAtom, prev => ({
            ...prev,
            authenticatedProfileError: error,
          }));
        },
      });
  };

  /**
   * Initiates session restore for current authenticated user
   **/
  restoreSession = () => {
    try {
      store.set(this.#userAtom, prev => ({
        ...prev,
        isAuthenticating: true,
      }));
      this.#sdk.api.auth.getCurrentUser();
    } catch (error) {
      store.set(this.#userAtom, prev => ({
        ...prev,
        authenticationError: error,
        isAuthenticating: false,
      }));
    }
  };

  /**
   * Takes a callback function and subscribes it to the store, when the store changes the callback is invoked.
   * This in turns causes a component to re-render
   * @param listener - callback listener which subscribes to the store
   * @returns function that cleans up the subscription
   **/
  subscribe = (listener: () => void) => {
    const subscription = store.sub(this.#userAtom, listener);
    return () => subscription();
  };

  /**
   * Get a snapshot of store data
   */
  getSnapshot = () => {
    return store.get(this.#userAtom);
  };
}
