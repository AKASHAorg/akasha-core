import { IUserState, IUserStore } from '@akashaorg/typings/lib/ui/store';

const INITIAL_STATE = {
  authenticatedDid: null,
  authenticationError: null,
  isAuthenticating: false,
  info: null,
  isLoadingInfo: false,
};

export const getUserStore = (initialState: IUserState = INITIAL_STATE): IUserStore => {
  const fakeDID = 'did:pkh:eip155:5:0xc47a483494db8fe455ba29a53a7f75349dfc02ff';
  let state = initialState;
  const listeners = new Set<() => void>();

  function setState(newState: IUserState) {
    state = {
      ...state,
      ...newState,
    };
    listeners.forEach(listener => listener());
  }

  return {
    login: () => {
      setState({ ...state, isAuthenticating: true });
      setTimeout(() => setState({ ...state, authenticatedDid: fakeDID }), 1000);
    },
    logout: () => {
      setState(INITIAL_STATE);
    },
    getUserInfo: () => jest.fn(),
    restoreSession: () => {
      setState({ ...state, isAuthenticating: true });
      setTimeout(() => setState({ ...state, authenticatedDid: fakeDID }), 1000);
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => Object.freeze(state),
  };
};
