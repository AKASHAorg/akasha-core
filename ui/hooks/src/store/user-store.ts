import getSDK from '@akashaorg/awf-sdk';
import type { IGetProfileInfo, IUserState, IUserStore } from '@akashaorg/typings/lib/ui';
import { createStore } from 'jotai';
import { atomWithImmer } from 'jotai-immer';

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
      this.#sdk.api.auth
        .signIn({
          provider,
          checkRegistered,
        })
        .then(result => {
          if (!result?.data) {
            store.set(this.#userAtom, prev => ({
              ...prev,
              isAuthenticating: false,
            }));
            return;
          }
          this.handleLoggedInState(result.data?.id);
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
   * Reset the store to the initial state
   */
  logout = () => {
    this.#sdk.api.auth.signOut().then(() => {
      store.set(this.#userAtom, () => this.#initialState);
    });
  };

  /**
   * Handles logged in state
   * Fetch the authenticated profile info for the authenticatedDID and set the authenticatedProfile state
   */
  handleLoggedInState = async (authenticatedDID: string) => {
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
      this.#sdk.api.auth.getCurrentUser().then(result => {
        if (!result) {
          store.set(this.#userAtom, prev => ({
            ...prev,
            isAuthenticating: false,
          }));
          return;
        }
        this.handleLoggedInState(result?.id);
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
