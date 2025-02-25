import { ChannelSettings, UserSettingType } from '@akashaorg/typings/lib/sdk';
import { TFunction } from 'i18next';

enum AppName {
  ANTENNA = 'Antenna App',
  PROFILE = 'Profile App',
  VIBES = 'Vibes App',
}

export type AppInfo = {
  index: number;
  enabled: boolean;
  appName: string;
  title: string;
  description: string;
};

export const getAppInfoFromUserSetting = (settings: UserSettingType[], t: TFunction): AppInfo[] => {
  return settings.map(setting => {
    const appInfo = getAppInfoByAppName(setting.appName, t);
    return {
      index: setting.index,
      appName: setting.appName,
      title: appInfo.title,
      description: appInfo.description,
      enabled: setting.enabled,
    };
  });
};

export const getAppInfoFromChannelSetting = (
  settings: ChannelSettings[],
  value,
  t: TFunction,
): AppInfo[] => {
  return settings.map(setting => {
    // description is actually the title of the option returned by PushProtocol channel api
    const appInfo = getAppInfoByAppName(setting.description, t);
    return {
      index: setting.index,
      appName: setting.description,
      title: appInfo.title,
      description: appInfo.description,
      enabled: value,
    };
  });
};

const getAppInfoByAppName = (appName: string, t: TFunction) => {
  switch (appName) {
    case AppName.ANTENNA:
      return {
        title: t('Antenna'),
        description: t(
          'Get notifications about new reflections on your beams people you follow & your interests.',
        ),
      };
      break;
    case AppName.PROFILE:
      return {
        title: t('Profile'),
        description: t('Get notifications about new followers'),
      };
      break;
    case AppName.VIBES:
      return {
        title: t('Vibes'),
        description: t('Get notifications from Vibes app'),
      };
    default:
      return {
        title: appName,
        description: t(`Get notifications from {{appName}}`, { appName }),
      };
  }
};
