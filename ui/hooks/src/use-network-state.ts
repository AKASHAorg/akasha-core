import React from 'react';

export interface UseNetworkProps {
  // channels.commons.web3Service
  web3Service: any;
}

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
const useNetworkState = (props: UseNetworkProps): [INetworkState, UseNetworkActions] => {
  const [state, dispatch] = React.useReducer(networkStateReducer, initialNetworkState);

  React.useEffect(() => {
    if (state.checkNetworkQuery) {
      const checkNetCall = props.web3Service.checkCurrentNetwork({});
      const checkNetCallSub = checkNetCall.subscribe({
        next: () => {
          dispatch({ type: 'CHECK_NETWORK_SUCCESS' });
        },
        error: () => {
          dispatch({ type: 'CHECK_NETWORK_ERROR' });
        },
      });
      return () => checkNetCallSub.unsubscribe();
    }
    return;
  }, [state.checkNetworkQuery]);

  const actions = {
    checkNetwork() {
      dispatch({ type: 'CHECK_NETWORK' });
    },
  };
  return [state, actions];
};

export default useNetworkState;
