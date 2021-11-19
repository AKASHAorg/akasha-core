import * as React from 'react';
import { lastValueFrom } from 'rxjs';

import getSDK from '@akashaproject/awf-sdk';
import { INJECTED_PROVIDERS } from '@akashaproject/sdk-typings/lib/interfaces/common';

import { logError } from './utils/error-handler';
import getProviderDetails, { IInjectedProviderDetails } from './utils/getProviderDetails';

export interface UseInjectedProviderActions {
  /**
   *  get injected provider
   */
  getInjectedProvider: () => void;
}

export interface IInjectedProviderState {
  name: INJECTED_PROVIDERS;
  details: IInjectedProviderDetails;
}

export type IInjectedProviderAction =
  | {
      type: 'GET_INJECTED_PROVIDER_SUCCESS';
      payload: INJECTED_PROVIDERS;
    }
  | {
      type: 'SET_PROVIDER_DETAILS';
      payload: IInjectedProviderDetails;
    };

const InjectedProviderStateReducer = (
  state: IInjectedProviderState,
  action: IInjectedProviderAction,
) => {
  switch (action.type) {
    case 'GET_INJECTED_PROVIDER_SUCCESS': {
      return {
        ...state,
        name: action.payload,
      };
    }
    case 'SET_PROVIDER_DETAILS': {
      return {
        ...state,
        details: action.payload,
      };
    }
    default:
      throw new Error('[InjectedProviderStateReducer] action is not defined!');
  }
};

// initial state
const initialInjectedProviderState = {
  name: INJECTED_PROVIDERS.NOT_DETECTED,
  details: {
    iconType: '',
    titleLabel: '',
    subtitleLabel: '',
  },
};

/**
 * A hook to get injected provider from the SDK
 */
export const useInjectedProvider = (): [IInjectedProviderState, UseInjectedProviderActions] => {
  const [injectedProvider, dispatch] = React.useReducer(
    InjectedProviderStateReducer,
    initialInjectedProviderState,
  );

  const actions: UseInjectedProviderActions = {
    async getInjectedProvider() {
      const sdk = getSDK();
      try {
        const provider = await lastValueFrom(sdk.services.common.web3.detectInjectedProvider());

        dispatch({ type: 'GET_INJECTED_PROVIDER_SUCCESS', payload: provider.data });

        const providerDetails = getProviderDetails(provider.data);

        dispatch({ type: 'SET_PROVIDER_DETAILS', payload: providerDetails });
      } catch (error) {
        logError('useInjectedProvider', error);
      }
    },
  };

  return [injectedProvider, actions];
};

export default useInjectedProvider;
