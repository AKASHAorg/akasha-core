import { useMutation, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom } from 'rxjs';
import getSDK from '@akashaproject/awf-sdk';
import { logError } from './utils/error-handler';
// import { AppsSchema } from '@akashaproject/awf-sdk/src/db/app.schema';

// @TODO - fix typings

export const APP_SETTINGS_KEY = 'App_Settings';

const getAppConfig = async appName => {
  const sdk = getSDK();
  const res: any = await lastValueFrom(sdk.services.appSettings.get(appName));
  return res.data;
};

/**
 * Hook to get configuration object for an installed app
 * @param appName - name of the app
 */
export function useGetAppConfig(appName: string) {
  return useQuery([APP_SETTINGS_KEY, appName], () => getAppConfig(appName), {
    enabled: !!appName,
    keepPreviousData: true,
    onError: (err: Error) => logError('useAppSettings.getAppConfig', err),
  });
}

const getAllInstalledApps = async () => {
  const sdk = getSDK();
  const res: any = await lastValueFrom(sdk.services.appSettings.getAll());
  return res.data;
};

/**
 * Hook to get all the user's installed apps
 */
export function useGetAllInstalledApps() {
  return useQuery([APP_SETTINGS_KEY], () => getAllInstalledApps(), {
    //   enabled: !!appName,
    keepPreviousData: true,
    onError: (err: Error) => logError('useAppSettings.getAppConfig', err),
  });
}

const installApp = async (appConfig: any) => {
  const sdk = getSDK();

  const res: any = await lastValueFrom(sdk.services.appSettings.install(appConfig));
  if (!res) {
    throw new Error('App already installed!');
  } else if (res.data) {
    return res.data;
  }
};

/**
 * Hook to persist an installed app config to a user's profile
 * @param app - Object
 */
export function useSaveInstalledApp() {
  const queryClient = useQueryClient();
  return useMutation(app => installApp(app), {
    onMutate: async app => {
      return app;
    },
    onError: err => {
      logError('useAppSettings.saveInstalledApp', err as Error);
    },
    onSuccess: async app => {
      await queryClient.fetchQuery([APP_SETTINGS_KEY, app.name], () => getAppConfig(app.name));
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(APP_SETTINGS_KEY);
    },
  });
}
