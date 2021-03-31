import React from 'react';

export interface UseNetworkProps {
  // channels.commons.web3Service
  web3Service: any;
}

export interface UseNetworkState {
  networkNotSupported: boolean;
}

export interface UseNetworkActions {
  checkNetwork: () => void;
}

const useNetworkState = (props: UseNetworkProps): [UseNetworkState, UseNetworkActions] => {
  const [state, setState] = React.useState<UseNetworkState>({
    networkNotSupported: false,
  });

  React.useEffect(() => {
    actions.checkNetwork();
  }, []);

  const actions = {
    checkNetwork() {
      const checkNetCall = props.web3Service.checkCurrentNetwork({});
      checkNetCall.subscribe(
        () => {
          return;
        },
        () => {
          setState({
            networkNotSupported: true,
          });
        },
      );
    },
  };
  return [state, actions];
};

export default useNetworkState;
