import { IAuthenticationState, IAuthenticationStore } from '@akashaorg/typings/lib/ui/store';
import { genProfileByDID } from './user';
import { AkashaProfile } from '@akashaorg/typings/lib/ui';

export function getUserInfo(): IAuthenticationState<AkashaProfile> {
  return {
    authenticatedDID: null,
    authenticatedProfile: null,
    authenticationError: null,
    authenticatedProfileError: null,
    isAuthenticating: false,
  };
}

export function getAuthenticationStore(
  initialState?: IAuthenticationState<AkashaProfile>,
): IAuthenticationStore<AkashaProfile> {
  const profileDID = 'did:pkh:eip155:5:0xc47a483494db8fe455ba29a53a7f75349dfc02ff';
  let state = initialState ? initialState : getUserInfo();
  const listeners = new Set<() => void>();

  function setState(newState: IAuthenticationState<AkashaProfile>) {
    state = {
      ...state,
      ...newState,
    };
    listeners.forEach(listener => listener());
  }

  return {
    login: () => {
      setState({ ...state, isAuthenticating: true });
      setTimeout(
        () =>
          setState({
            ...state,
            authenticatedProfile: genProfileByDID({ profileDID }).akashaProfile,
            authenticatedDID: profileDID,
          }),
        1000,
      );
    },
    logout: () => {
      setState(getUserInfo());
    },
    restoreSession: () => {
      setState({ ...state, isAuthenticating: true });
      setTimeout(
        () =>
          setState({
            ...state,
            authenticatedProfile: genProfileByDID({ profileDID }).akashaProfile,
            authenticatedDID: profileDID,
          }),
        1000,
      );
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => Object.freeze(state),
  };
}
