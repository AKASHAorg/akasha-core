import { useQuery } from 'react-query';
import getSDK from '@akashaorg/awf-sdk';
import { logError } from './utils/error-handler';
import { lastValueFrom } from 'rxjs';

export const INTEGRATIONS_KEY = 'Integrations';
export const RELEASES_KEY = 'Releases';

const getIntegrationInfo = async integrationId => {
  const sdk = getSDK();
  const res = await sdk.api.icRegistry.getIntegrationInfo(integrationId);
  return res.data;
};

/**
 * Hook to get integration package info
 */
export function useGetIntegrationInfo(integrationId: string) {
  return useQuery([INTEGRATIONS_KEY, integrationId], () => getIntegrationInfo(integrationId), {
    enabled: !!integrationId,
    keepPreviousData: true,
    onError: (err: Error) => logError('useIntegrationRegistry.getIntegrationInfo', err),
  });
}

const getIntegrationsInfo = async (opt: { name?: string; id?: string }[]) => {
  const sdk = getSDK();
  const res = await lastValueFrom(sdk.api.icRegistry.getIntegrationsInfo(opt));
  return res.data;
};

/**
 * Hook to get package info for multiple integrations by name or id
 */
export function useGetIntegrationsInfo(opt: { name?: string; id?: string }[]) {
  return useQuery([INTEGRATIONS_KEY, 'info'], () => getIntegrationsInfo(opt), {
    enabled: !!opt?.length,
    keepPreviousData: true,
    onError: (err: Error) => logError('useIntegrationRegistry.getIntegrationsInfo', err),
  });
}

const getIntegrationsCount = async () => {
  const sdk = getSDK();
  const res = await sdk.api.icRegistry.getIntegrationsCount();
  return res.data;
};

/**
 * Hook to get the number of published integrations
 */
export function useGetIntegrationsCount() {
  return useQuery([INTEGRATIONS_KEY, 'total'], () => getIntegrationsCount(), {
    keepPreviousData: true,
    onError: (err: Error) => logError('useIntegrationRegistry.getIntegrationsCount', err),
  });
}

const getIntegrationId = async (integrationName: string) => {
  const sdk = getSDK();
  const res = await sdk.api.icRegistry.getIntegrationId(integrationName);
  return res.data;
};

/**
 * Hook to get integration id by its name
 */
export function useGetIntegrationId(integrationName: string) {
  return useQuery([INTEGRATIONS_KEY, integrationName], () => getIntegrationId(integrationName), {
    keepPreviousData: true,
    onError: (err: Error) => logError('useIntegrationRegistry.getIntegrationId', err),
  });
}

const getIntegrationReleaseId = async (integrationName: string, version: string) => {
  const sdk = getSDK();
  const res = await sdk.api.icRegistry.getIntegrationReleaseId(integrationName, version);
  return res.data;
};

/**
 * Hook to get integration release id by its name and version
 */
export function useGetIntegrationReleaseId(
  integrationName: string,
  version: string,
  enabler?: boolean,
) {
  return useQuery(
    [RELEASES_KEY, `${integrationName}-${version}`],
    () => getIntegrationReleaseId(integrationName, version),
    {
      enabled: !!enabler,
      keepPreviousData: true,
      onError: (err: Error) => logError('useIntegrationRegistry.getIntegrationReleaseId', err),
    },
  );
}

const getAllIntegrationsIds = async (offset?: number) => {
  const sdk = getSDK();
  const res = await sdk.api.icRegistry.getAllIntegrationsIds(offset);
  let nextIndex = res.data?.nextIndex?.toNumber();
  let integrationIds = res.data?.integrationIds;
  while (nextIndex) {
    const nextRes = await sdk.api.icRegistry.getAllIntegrationsIds(nextIndex);
    integrationIds = integrationIds.concat(nextRes.data?.integrationIds);
    nextIndex = nextRes.data?.nextIndex?.toNumber();
  }
  return integrationIds;
};

/**
 * Hook to get all the published integrations ids
 */
export function useGetAllIntegrationsIds(enabler = true, offset?: number) {
  return useQuery([INTEGRATIONS_KEY, 'ids'], () => getAllIntegrationsIds(offset), {
    enabled: !!enabler,
    keepPreviousData: true,
    onError: (err: Error) => logError('useIntegrationRegistry.getAllIntegrationsIds', err),
  });
}

const getAllIntegrationReleaseIds = async (integrationName: string, offset?: number) => {
  const sdk = getSDK();
  const res = await sdk.api.icRegistry.getAllIntegrationReleaseIds(integrationName, offset);
  if (res.data.releaseIds) {
    res.data.releaseIds = [...new Set(res.data.releaseIds)];
  }
  return res.data;
};

/**
 * Hook to get all the release ids for an integration
 */
export function useGetAllIntegrationReleaseIds(integrationName: string, offset?: number) {
  return useQuery(
    [RELEASES_KEY, integrationName],
    () => getAllIntegrationReleaseIds(integrationName, offset),
    {
      enabled: !!integrationName,
      keepPreviousData: true,
      onError: (err: Error) => logError('useIntegrationRegistry.getAllIntegrationReleaseIds', err),
    },
  );
}

const getIntegrationReleaseInfo = async releaseId => {
  const sdk = getSDK();
  const res = await sdk.api.icRegistry.getIntegrationReleaseInfo(releaseId);
  return res.data;
};

/**
 * Hook to get integration release info
 */
export function useGetIntegrationReleaseInfo(releaseId: string) {
  return useQuery([RELEASES_KEY, releaseId], () => getIntegrationReleaseInfo(releaseId), {
    enabled: !!releaseId,
    keepPreviousData: true,
    onError: (err: Error) => logError('useIntegrationRegistry.getIntegrationReleaseInfo', err),
  });
}

const getIntegrationsReleaseInfo = async releaseIds => {
  const sdk = getSDK();
  const result = await Promise.all(
    releaseIds.map(async releaseId => {
      return (await sdk.api.icRegistry.getIntegrationReleaseInfo(releaseId)).data;
    }),
  );

  return result;
};

/**
 * Hook to get multiple integrations release info
 */
export function useGetIntegrationsReleaseInfo(releaseIds: string[]) {
  return useQuery([RELEASES_KEY, 'info'], () => getIntegrationsReleaseInfo(releaseIds), {
    enabled: !!releaseIds?.length,
    keepPreviousData: true,
    onError: (err: Error) => logError('useIntegrationRegistry.getIntegrationReleaseInfo', err),
  });
}

const getLatestReleaseInfo = async (opt: { name?: string; id?: string }[]) => {
  const sdk = getSDK();
  const res = await lastValueFrom(sdk.api.icRegistry.getLatestReleaseInfo(opt));
  // add messaging app mock to response
  if (!res.data.getLatestRelease.some(rel => rel.name === '@akashaorg/app-messaging')) {
    res.data.getLatestRelease.push({
      id: '0x82d31f280645cb2f74a47115a36f1e1b4370eda1812cf4d38d9107996bb60560',
      name: '@akashaorg/app-messaging',
      version: 'v0.1.0',
      integrationType: 0,
      sources: [],
      integrationID: '0x0f7b806cb610e298f4108f77c5454edafdd48a213ac6df2466816442b2814061',
      author: '0xADE0510E72f60789DD17aAFc28629Ee4D9C0Ba72',
      enabled: true,
      links: {
        publicRepository: 'https://github.com/AKASHAorg/akasha-framework#readme',
        documentation: '',
        detailedDescription: '',
      },
      manifestData: {
        mainFile: 'index.js',
        license: 'AGPL-3.0',
        keywords: [],
        description:
          'The AKASHA team builds this application so you can privately message friends.',
        displayName: 'Messages',
      },
      createdAt: null,
    });
  }
  return res.data;
};

/**
 * Hook to get latest release info for integrations
 */
export function useGetLatestReleaseInfo(opt: { name?: string; id?: string }[]) {
  return useQuery([RELEASES_KEY, 'latest'], () => getLatestReleaseInfo(opt), {
    enabled: opt?.length > 0,
    keepPreviousData: true,
    onError: (err: Error) => logError('useIntegrationRegistry.getLatestReleaseInfo', err),
  });
}
