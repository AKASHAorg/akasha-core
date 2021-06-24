import React from 'react';
import getSDK from '@akashaproject/awf-sdk';

export interface UseNetworkActions {
  /**
   *  check if user is logged in on mainnet or a testnet
   */
  checkNetwork: () => void;
}

export interface INetworkState {
  networkNotSupported: boolean;
  checkNetworkQuery: boolean;
}

const initialNetworkState: INetworkState = {
  networkNotSupported: false,
  checkNetworkQuery: false,
};

export type INetworkAction =
  | { type: 'CHECK_NETWORK' }
  | { type: 'CHECK_NETWORK_SUCCESS' }
  | { type: 'CHECK_NETWORK_ERROR' };

const networkStateReducer = (state: INetworkState, action: INetworkAction) => {
  switch (action.type) {
    case 'CHECK_NETWORK':
      return { ...state, checkNetworkQuery: true };
    case 'CHECK_NETWORK_SUCCESS':
      return { ...state, checkNetworkQuery: false, networkNotSupported: false };
    case 'CHECK_NETWORK_ERROR':
      return { ...state, checkNetworkQuery: false, networkNotSupported: true };

    default:
      throw new Error('[UseNetworkStateReducer] action is not defined!');
  }
};

/* Note: Do not call checkNetwork automatically! Only after loginEthAddress detected */
const useNetworkState = (): [INetworkState, UseNetworkActions] => {
  const sdk = getSDK();

  const [state, dispatch] = React.useReducer(networkStateReducer, initialNetworkState);

  React.useEffect(() => {
    if (state.checkNetworkQuery) {
      (async () => {
        try {
          await sdk.services.common.web3.checkCurrentNetwork();
          dispatch({ type: 'CHECK_NETWORK_SUCCESS' });
        } catch (error) {
          dispatch({ type: 'CHECK_NETWORK_ERROR' });
        }
      })();
    }
  }, [state.checkNetworkQuery]);

  const actions = {
    checkNetwork() {
      dispatch({ type: 'CHECK_NETWORK' });
    },
  };
  return [state, actions];
};

export default useNetworkState;
