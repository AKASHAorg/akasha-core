import { ChannelSettings, UserSettingType } from '@akashaorg/typings/lib/sdk';

enum AppName {
  ANTENNA = 'Antenna App',
  PROFILE = 'Profile App',
  VIBES = 'Vibes App',
}

const appInformation = [
  {
    appName: AppName.ANTENNA,
    title: 'Antenna',
    description:
      'Get notifications about new reflections on your beams people you follow & your interests.',
  },
  {
    appName: AppName.PROFILE,
    title: 'Profile',
    description: 'Get notifications about new followers',
  },
  {
    appName: AppName.VIBES,
    title: 'Vibes',
    description: 'Get notifications from Vibes app',
  },
];

export type AppInfo = {
  index: number;
  enabled: boolean;
  appName: string;
  title: string;
  description: string;
};

export const getAppInfoFromUserSetting = (settings: UserSettingType[]): AppInfo[] => {
  return settings.map(setting => {
    const appInfo = getAppInfoByAppName(setting.appName);
    return {
      index: setting.index,
      appName: setting.appName,
      title: appInfo.title,
      description: appInfo.description,
      enabled: setting.enabled,
    };
  });
};

export const getAppInfoFromChannelSetting = (settings: ChannelSettings[], value): AppInfo[] => {
  return settings.map(setting => {
    // description is actually the title of the option returned by PushProtocol channel api
    const appInfo = getAppInfoByAppName(setting.description);
    return {
      index: setting.index,
      appName: setting.description,
      title: appInfo.title,
      description: appInfo.description,
      enabled: value,
    };
  });
};

const getAppInfoByAppName = (appName: string) => {
  const appInfo = appInformation.find(appInfo => appInfo.appName === appName);
  // In case a new Option is added in the PushProtocol's channel and we did not cover the title and the description in the appInformation array this will generate a default title and description so it be present in the list of apps
  if (!appInfo) {
    return {
      title: appName,
      description: `Get notifications from ${appName}`,
    };
  }
  return appInfo;
};
