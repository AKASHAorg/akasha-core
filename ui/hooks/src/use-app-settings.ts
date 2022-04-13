import { useMutation, useQuery, useQueryClient } from 'react-query';
import getSDK from '@akashaorg/awf-sdk';
import { logError } from './utils/error-handler';
// import { AppsSchema } from '@akashaorg/awf-sdk/src/db/app.schema';

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

const appInstall = async (app: { name?: string; id?: string }) => {
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
export function useInstallApp() {
  const queryClient = useQueryClient();
  return useMutation((app: { name?: string; id?: string }) => appInstall(app), {
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

const appUninstall = async (appName?: string) => {
  const sdk = getSDK();
  await sdk.services.appSettings.uninstall(appName);
};

/**
 * Hook to uninstall an app
 * @param appName - application name
 */
export function useUninstallApp() {
  const queryClient = useQueryClient();
  return useMutation((appName: string) => appUninstall(appName), {
    onError: err => {
      logError('useAppSettings.uninstallApp', err as Error);
    },
    onSuccess: async (_res, variables) => {
      await queryClient.fetchQuery([APP_SETTINGS_KEY, variables], () => getAppConfig(variables));
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(APP_SETTINGS_KEY);
    },
  });
}
