import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import getSDK from '@akashaorg/awf-sdk';
import { logError } from './utils/error-handler';

export const SETTING_KEY = 'Notification-Settings';

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
 * @param app - The app's name for example @akashaorg/app-akasha-verse
 * @param options - Array of option pairs [optionName, value]
 * @example useSaveSettings hook
 * ```typescript
 * const saveSettings = useSaveSettings();
 * saveSettings.mutate(JSON.stringify({ app: '@akashaorg/app-akasha-verse', options: [['key', 'value']] }))
 * ```
 */
export function useSaveSettings() {
  const queryClient = useQueryClient();

  return useMutation(
    (params: { app: string; options: Record<string, string | boolean | number> }) =>
      saveSettings(params),
    {
      onError: (err: Error) => logError('useSaveSettings', err),
      onSuccess: data => {
        queryClient.invalidateQueries([SETTING_KEY]);
        return data;
      },
      onMutate: () => {
        true;
      },
      mutationKey: [SETTING_KEY],
    },
  );
}

const getSettings = async (app: string) => {
  const sdk = getSDK();

  const res = await sdk.services.settings.get(app);
  if (res.data?.options) return Object.fromEntries(res.data.options);
  return null;
};

/**
 * Hook to get saved settings for an app
 * @example useGetSettings hook
 * ```typescript
 * const savedSettingsQuery = useGetSettings('@akashaorg/app-akasha-verse');
 *
 * const savedSettings = savedSettingsQuery.data;
 * ```
 */
export function useGetSettings(app: string) {
  return useQuery([SETTING_KEY, app], () => getSettings(app), {
    enabled: !!app,
    onError: (err: Error) => logError('useGetSettings', err),
  });
}
