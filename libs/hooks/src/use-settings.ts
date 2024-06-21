import getSDK from '@akashaorg/awf-sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAkashaStore } from './store';

async function saveSettings({
  app,
  options,
}: {
  app: string;
  options: Record<string, string | boolean | number>;
}) {
  if (!options || !app) return;

  const sdk = getSDK();

  const existingSettings = await getSettings(app);

  const newSettings = existingSettings ? Object.assign(existingSettings, options) : options;

  const res = await sdk.services.settings.set(
    app,
    Object.entries(newSettings) as [[string, string | number | boolean]],
  );
  return res.data;
}

/**
 * Hook to save app's settings using sdk settings service
 * @example useSaveSettings hook
 * ```typescript
 * const { saveNotificationSettings } = useSaveSettings();
 * saveNotificationSettings(
 *  { app: '@akashaorg/app-extensions', options: NotificationsOptions },
 *  callback: {onComplete: () => void}
 *  )
 * ```
 */
export function useSaveSettings() {
  const [data, setData] = useState<unknown>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  const saveNotificationSettings = useCallback(
    (
      params: { app: string; options: Record<string, string | boolean | number> },
      callback?: { onComplete: () => void },
    ) => {
      setIsLoading(true);

      const saveSettingCall = async params => {
        try {
          const res = await saveSettings(params);
          setData(res);
          setIsLoading(false);
          if (callback.onComplete && typeof callback.onComplete === 'function') {
            callback.onComplete();
          }
        } catch (err) {
          setError(err);
        }
      };

      saveSettingCall(params);
    },
    [],
  );
  return { saveNotificationSettings, isLoading, data, error };
}

const getSettings = async (app: string) => {
  const sdk = getSDK();

  const res = await sdk.services.settings.get(app);
  if (res.data?.options) return Object.fromEntries(res.data.options);
  return null;
};

/**
 * Hook to get saved settings for an app
 * @param app - string: The app's name for example \@akashaorg/app-extensions
 * @example useGetSettings hook
 * ```typescript
 * const savedSettingsQuery = useGetSettings('@akashaorg/app-akasha-verse');
 * const savedSettings = savedSettingsQuery.data;
 * ```
 */

export function useGetSettings(app: string) {
  const {
    data: { authenticatedDID, isAuthenticating: loadingLoginData },
  } = useAkashaStore();
  const [settings, setSettings] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [error, setError] = useState<{ message: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSettings(app);
        if (res) {
          setSettings(res);
          setError(null);
          setIsLoading(false);
        } else {
          setSettings(null);
          setIsLoading(false);
        }
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };
    if (!loadingLoginData && !authenticatedDID) {
      setIsLoading(false);
      return;
    }

    if (authenticatedDID) {
      fetchData();
    }
  }, [app, authenticatedDID, loadingLoginData]);

  return { data: settings, isLoading, error };
}

/**
 * Hook to get the indexing DID used by the SDK's GraphQL client.
 *
 * @returns string - The indexing DID currently used by the SDK's GraphQL client.
 *
 * @example
 * const currentIndexingDID = useGetIndexingDID();
 **/

export function useGetIndexingDID() {
  const sdk = getSDK();
  return useMemo(() => sdk.services.gql.indexingDID, [sdk.services.gql.indexingDID]);
}
