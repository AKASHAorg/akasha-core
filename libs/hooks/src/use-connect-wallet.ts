import getSDK from '@akashaorg/core-sdk';
import { useCallback, useEffect, useState } from 'react';
import { useTheme } from './use-theme';
import { logError } from './utils/error-handler';

/**
 * Hook for connecting to a user's wallet (through Metamask or any other compatible applications)
 * @example useConnectWallet hook
 * ```typescript
 * const connectWalletCall = useConnectWallet();
 *  // make the call to the connect function when appropriate:
 * connectWalletCall.connect();
 * ```
 **/
export function useConnectWallet() {
  const { theme } = useTheme();
  const sdk = getSDK();

  useEffect(() => {
    if (theme === 'Dark-Theme' && sdk.services.common.web3.getCurrentTheme() !== 'dark') {
      sdk.services.common.web3.toggleDarkTheme(true);
      return;
    }
    if (theme === 'Light-Theme' && sdk.services.common.web3.getCurrentTheme() !== 'light') {
      sdk.services.common.web3.toggleDarkTheme();
    }
  }, [sdk.services.common.web3, theme]);

  const [data, setData] = useState<string | null>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(() => {
    setIsLoading(true);
    const connectWalletApiCall = async () => {
      try {
        const resp = await sdk.api.auth.connectAddress();
        if (resp) {
          setData(resp);
          setIsLoading(false);
        }
      } catch (err) {
        logError('useConnectWallet', err);
        setError(err);
        setData(null);
      }
    };

    connectWalletApiCall();
  }, []);

  return { connect, data, isLoading, error, isSuccess: !!data, isError: !!error };
}
