import { WorldConfig } from '@akashaorg/typings/lib/ui';
import getSDK from '@akashaorg/awf-sdk';

export const getRemoteLatestExtensionInfos = async (extensions: { name: string }[]) => {
  return Promise.resolve([]);
};

export const getExtensionsData = async (extNames: string[], worldConfig: WorldConfig) => {
  const remote = extNames.filter(extName => {
    return !worldConfig.registryOverrides.some(ext => ext.name === extName);
  });
  const local = extNames
    .filter(extensionName => {
      return !remote.includes(extensionName);
    })
    .map(e => worldConfig.registryOverrides.find(ext => ext.name === e));

  const remotes = await getRemoteLatestExtensionInfos(remote.map(e => ({ name: e })));

  return remotes.concat(local);
};

export const getWorldDefaultExtensions = async (worldConfig: WorldConfig) => {
  const defaultWorldExt = [
    worldConfig.layout,
    worldConfig.homepageApp,
    ...worldConfig.defaultApps,
    ...worldConfig.defaultWidgets,
  ];
  return getExtensionsData(defaultWorldExt, worldConfig);
};

export const getUserInstalledExtensions = async () => {
  const sdk = getSDK();
  const resp = await sdk.services.appSettings.getAll();
  return resp.data;
};
