import getSDK from '@akashaorg/awf-sdk';
import { logError } from './utils/error-handler';
import { useEffect, useState } from 'react';

const checkHealth = async () => {
  const sdk = getSDK();
  const res = await sdk.services.common.misc.getApiStatus();
  return res;
};

export const usePlaformHealthCheck = () => {
  const [data, setData] = useState<{
    statusCode: number;
    success: boolean;
  } | null>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await checkHealth();
        if (res) {
          setData(res);
          setIsLoading(false);
        }
      } catch (err) {
        setData(null);
        logError('usePlaformHealthCheck', err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading };
};
