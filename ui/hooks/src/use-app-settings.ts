import { useMutation, useQuery, useQueryClient } from 'react-query';
import getSDK from '@akashaproject/awf-sdk';
import { logError } from './utils/error-handler';
// import { AppsSchema } from '@akashaproject/awf-sdk/src/db/app.schema';

// @TODO - fix typings

export const APP_SETTINGS_KEY = 'App_Settings';

const getAppConfig = async appName => {
  const sdk = getSDK();
  const res = await sdk.services.appSettings.get(appName);
  return res.data;
};

/**
 * Hook to get configuration object for an installed app
 * @param appName - name of the app
 */
export function useGetAppConfig(appName: string, enabler?: boolean) {
  return useQuery([APP_SETTINGS_KEY, appName], (): Promise<any> => getAppConfig(appName), {
    enabled: !!enabler,
    keepPreviousData: true,
    onError: (err: Error) => logError('useAppSettings.getAppConfig', err),
  });
}

const getAllInstalledApps = async () => {
  const sdk = getSDK();
  const res = await sdk.services.appSettings.getAll();
  return res.data;
};

/**
 * Hook to get all the user's installed apps
 */
export function useGetAllInstalledApps(enabler?: boolean) {
  return useQuery([APP_SETTINGS_KEY], (): Promise<any> => getAllInstalledApps(), {
    enabled: !!enabler,
    keepPreviousData: true,
    onError: (err: Error) => logError('useAppSettings.getAllInstalledApps', err),
  });
}

const installApp = async (app: { name?: string; id?: string }) => {
  const sdk = getSDK();
  const res = await sdk.services.appSettings.install(app);
  if (!res) {
    throw new Error('App already installed!');
  } else if (res) {
    return res;
  }
};

/**
 * Hook to persist an installed app config to a user's profile
 * @param app - Object
 */
export function useSaveInstalledApp() {
  const queryClient = useQueryClient();
  return useMutation((app: { name?: string; id?: string }) => installApp(app), {
    onError: err => {
      logError('useAppSettings.saveInstalledApp', err as Error);
    },
    onSuccess: async (_res, variables) => {
      await queryClient.fetchQuery([APP_SETTINGS_KEY, variables.name], () =>
        getAppConfig(variables.name),
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(APP_SETTINGS_KEY);
    },
  });
}
