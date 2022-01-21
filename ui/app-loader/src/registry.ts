import { BaseIntegrationInfo } from '@akashaproject/ui-awf-typings/lib/app-loader';
import getSDK from '@akashaproject/awf-sdk';

/**
 * Get info about the integrations
 */

export const getReleaseInfo = async (releaseId: string) => {
  const sdk = getSDK();
  const releaseInfo = await sdk.api.ens.getIntegrationReleaseInfo(releaseId);
  return releaseInfo;
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
    const integrationIdResp = await sdk.api.ens.getIntegrationId(integrationDef.name);
    if (integrationIdResp.data?.id) {
      const integrationInfo = await sdk.api.ens.getIntegrationInfo(integrationIdResp.data.id);
      const release = await getReleaseInfo(integrationInfo.data.latestReleaseId);
      const manifest = await getManifest(release.data.manifestHash);
      return {
        ...release,
        ...manifest,
      };
    }
  }
  // if a specific version is specified in the config file
  const releaseIdResp = await sdk.api.ens.getIntegrationReleaseId(
    integrationDef.name,
    integrationDef.version,
  );
  if (releaseIdResp.data?.id) {
    const release = await getReleaseInfo(releaseIdResp.data.id);
    const manifest = await getManifest(release.data.manifestHash);
    return {
      ...release,
      ...manifest,
    };
  }
};
