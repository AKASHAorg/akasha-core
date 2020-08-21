import { action, thunk, createComponentStore, persist, Action, Thunk } from 'easy-peasy';
import { EthProviders } from '@akashaproject/ui-awf-typings';
import { race } from 'rxjs';
import { filter, takeLast } from 'rxjs/operators';

export interface LoginState {
  jwtToken: string | null;
  ethAddress: string | null;
  providerListVisibility: boolean;
  learnMoreVisibility: boolean;
  selectedProvider: string | null;
  errors: {};
}

export interface IStateErrorPayload {
  errorKey: string;
  error: Error;
  critical: boolean;
}

export interface LoginStateModel {
  data: LoginState;
  updateData: Action<LoginStateModel, Partial<LoginState>>;
  createError: Action<LoginStateModel, IStateErrorPayload>;
  authorize: Thunk<LoginStateModel, EthProviders>;
  setProviderListVisibility: Action<LoginStateModel, { isVisible: boolean }>;
  setSelectedProvider: Action<
    LoginStateModel,
    { selectedProvider: 'metamask' | 'walletconnect' | null }
  >;
  setLearnMoreVisibility: Action<LoginStateModel, { isVisible: boolean }>;
}

export const loginStateModel: LoginStateModel = {
  data: persist(
    {
      ethAddress: null,
      jwtToken: null,
      providerListVisibility: false,
      learnMoreVisibility: false,
      selectedProvider: null,
      errors: {},
    },
    {
      blacklist: [
        'errors',
        'providerListVisibility',
        'learnMoreVisibility',
        'selectedProvider',
        // this doesn't play ok with global channels, will require a session api before enabling persist
        'jwtToken',
      ],
    },
  ),
  updateData: action((state, payload) => {
    state.data = Object.assign({}, state.data, payload);
  }),
  // add errors to store, merging them with old ones
  createError: action((state, payload) => {
    state.data = Object.assign({}, state.data, {
      errors: {
        ...state.data.errors,
        [payload.errorKey]: {
          error: payload.error,
          critical: payload.critical,
        },
      },
    });
  }),
  authorize: thunk(async (actions, ethProvider, { injections }) => {
    const { auth } = injections.channels;
    try {
      const call = auth.authService.signIn(ethProvider);
      // handle the case where signIn was triggered from another place
      const globalCall = injections.globalChannel.pipe(
        filter((response: any) => response.channelInfo.method === 'signIn'),
        takeLast(1),
      );
      race(call, globalCall).subscribe(
        (response: any) => {
          actions.updateData({
            jwtToken: response.data.token,
            ethAddress: response.data.ethAddress,
            selectedProvider: null,
          });
        },
        (err: Error) => {
          actions.createError({
            errorKey: 'action[subscription].authorize',
            error: err,
            critical: false,
          });
        },
      );
    } catch (ex) {
      actions.createError({
        errorKey: 'action.authorize',
        error: ex,
        critical: false,
      });
    }
  }),
  setProviderListVisibility: action((state, payload) => {
    state.data = Object.assign({}, state.data, {
      providerListVisibility: payload.isVisible,
    });
  }),
  setSelectedProvider: action((state, payload) => {
    state.data = Object.assign({}, state.data, {
      selectedProvider: payload.selectedProvider,
    });
  }),
  setLearnMoreVisibility: action((state, payload) => {
    state.data = Object.assign({}, state.data, {
      learnMoreVisibility: payload.isVisible,
    });
  }),
};

export const useLoginState = (channels?: any, globalChannel?: any, logger?: any) =>
  createComponentStore(loginStateModel, {
    name: 'login-widget_LoginState',
    injections: { channels, logger, globalChannel },
  })();
