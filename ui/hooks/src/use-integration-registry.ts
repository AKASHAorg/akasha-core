import { useQuery } from 'react-query';
import getSDK from '@akashaorg/awf-sdk';
import { logError } from './utils/error-handler';

export const INTEGRATIONS_KEY = 'Integrations';
export const RELEASES_KEY = 'Releases';

const getIntegrationInfo = async integrationId => {
  const sdk = getSDK();
  return sdk.api.icRegistry.getIntegrationInfo(integrationId);
};

/**
 * Hook to get integration package info
 * @example useGetIntegrationInfo hook
 * ```typescript
 * const integrationInfoQuery = useGetIntegrationInfo('some-integration-id');
 *
 * const integrationInfo = integrationInfoQuery.data;
 * ```
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
  return sdk.api.icRegistry.getIntegrationsInfo(opt);
};

/**
 * Hook to get package info for multiple integrations by name or id
 * @example useGetIntegrationsInfo hook
 * ```typescript
 * const integrationsInfoQuery = useGetIntegrationsInfo([{ name: 'some-integration-name-1' }, { name: 'some-integration-name-2' }]);
 *
 * const integrationsInfo = integrationsInfoQuery.data;
 * ```
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
 * @example useGetIntegrationsCount hook
 * ```typescript
 * const integrationsCountQuery = useGetIntegrationsCount();
 *
 * const integrationCount = integrationsCountQuery.data;
 * ```
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
 * @example useGetIntegrationId hook
 * ```typescript
 * const integrationIdQuery = useGetIntegrationId('awesome integration');
 *
 * const integrationId = integrationIdQuery.data;
 * ```
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
 * @example useGetIntegrationReleaseId hook
 * ```typescript
 * const integrationReleaseIdQuery = useGetIntegrationReleaseId('awesome integration', '0.1.1', true);
 *
 * const integrationReleaseId = integrationReleaseIdQuery.data;
 * ```
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
 * @example useGetAllIntegrationsIds hook
 * ```typescript
 * const availableIntegrationsQuery = useGetAllIntegrationsIds(true);
 *
 * const availableIntegrations = availableIntegrationsQuery.data
 * ```
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
 * @example useGetAllIntegrationReleaseIds hook
 * ```typescript
 * const releaseIdsQuery = useGetAllIntegrationReleaseIds('awesome integration');
 *
 * const releaseIds = releaseIdsQuery.data?.releaseIds
 * ```
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
  return sdk.api.icRegistry.getIntegrationReleaseInfo(releaseId);
};

/**
 * Hook to get integration release info
 * @example useGetIntegrationReleaseInfo hook
 * ```typescript
 * const latestReleaseInfoQuery = useGetIntegrationReleaseInfo('some-release-id');
 *
 * const latestReleaseInfo = latestReleaseInfoQuery.data
 * ```
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
      return sdk.api.icRegistry.getIntegrationReleaseInfo(releaseId);
    }),
  );

  return result;
};

/**
 * Hook to get multiple integrations release info
 * @example useGetIntegrationsReleaseInfo hook
 * ```typescript
 * const releaseInfoQuery = useGetIntegrationsReleaseInfo(['some-release-id-1', 'some-release-id-2', 'some-release-id-3']);
 *
 * const releasesInfo = releaseInfoQuery.data
 * ```
 * example mock data for an integration to test locally
 * ```typescript
 * if (!res.data.getLatestRelease.some(rel => rel.name === '@akashaorg/app-messaging')) {
 *  res.data.getLatestRelease.push({
 *     id: '0x82d31f280645cb2f74a47115a36f1e1b4370eda1812cf4d38d9107996bb60560',
 *     name: '@akashaorg/app-messaging',
 *     version: 'v0.1.0',
 *     integrationType: 0,
 *     sources: [],
 *     integrationID: '0x0f7b806cb610e298f4108f77c5454edafdd48a213ac6df2466816442b2814061',
 *     author: '0xADE0510E72f60789DD17aAFc28629Ee4D9C0Ba72',
 *    enabled: true,
 *     links: {
 *       publicRepository: 'https://github.com/AKASHAorg/akasha-framework#readme',
 *       documentation: '',
 *       detailedDescription: '',
 *     },
 *     manifestData: {
 *       mainFile: 'index.js',
 *       license: 'AGPL-3.0',
 *       keywords: [],
 *       description:
 *         'The AKASHA team builds this application so you can privately message friends.',
 *       displayName: 'Messages',
 *     },
 *     createdAt: null,
 *   });
 * }
 * ```
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
  // add messaging app mock to response here
  return sdk.api.icRegistry.getLatestReleaseInfo(opt);
};

/**
 * Hook to get latest release info for integrations
 * @example useGetLatestReleaseInfo hook
 * ```typescript
 * const latestReleaseInfoQuery = useGetLatestReleaseInfo([{ id: 'some-release-id-1' }, { id: 'some-release-id-2' }, { id: 'some-release-id-3' }]);
 *
 * const latestReleasesInfo = React.useMemo(() => {
    return latestReleaseInfoQuery.data?.getLatestRelease;
  }, [latestReleaseInfoQuery.data?.getLatestRelease]);
 * ```
 */
export function useGetLatestReleaseInfo(opt: { name?: string; id?: string }[]) {
  return useQuery([RELEASES_KEY, `latest-${opt.length}`], () => getLatestReleaseInfo(opt), {
    enabled: opt?.length > 0,
    keepPreviousData: true,
    onError: (err: Error) => logError('useIntegrationRegistry.getLatestReleaseInfo', err),
  });
}
