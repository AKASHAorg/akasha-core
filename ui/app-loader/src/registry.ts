import { BaseIntegrationInfo } from '@akashaproject/ui-awf-typings/lib/app-loader';
import getSDK from '@akashaproject/awf-sdk';

/**
 * Get info about the integrations
 */

export const getReleaseInfo = async (releaseId: string) => {
  const sdk = getSDK();
  return sdk.api.icRegistry.getIntegrationReleaseInfo(releaseId);
};

export const getManifest = async manifestHash => {
  // TODO: get manifest from ipfs
  return manifestHash;
};

export const getIntegrationInfo = async (integrationDef: {
  name: string;
  version: string;
}): Promise<BaseIntegrationInfo> => {
  const sdk = getSDK();
  // if the latest version is specified in the config file
  if (integrationDef.version === 'latest') {
    const integrationIdResp = await sdk.api.icRegistry.getIntegrationId(integrationDef.name);
    if (integrationIdResp.data?.id) {
      const integrationInfo = await sdk.api.icRegistry.getIntegrationInfo(
        integrationIdResp.data.id,
      );
      const release = await getReleaseInfo(integrationInfo.data.latestReleaseId);
      return {
        ...release.data,
      };
    }
  }
  // if a specific version is specified in the config file
  const releaseIdResp = await sdk.api.icRegistry.getIntegrationReleaseId(
    integrationDef.name,
    integrationDef.version,
  );
  if (releaseIdResp.data?.id) {
    const release = await getReleaseInfo(releaseIdResp.data.id);
    return {
      ...release.data,
    };
  }
};
