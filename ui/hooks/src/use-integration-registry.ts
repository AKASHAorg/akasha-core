import { useQuery } from 'react-query';
import getSDK from '@akashaproject/awf-sdk';
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
 * @param integrationId - id of the integration
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
 * @param integrationId - id of the integration
 * @param integrationId - id of the integration
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
 * @param integrationName - name of the integration
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
 * @param integrationName - name of the integration
 * @param version - release version
 */
export function useGetIntegrationReleaseId(
  integrationName: string,
  version: string,
  enabler?: boolean,
) {
  return useQuery(
    [RELEASES_KEY, integrationName],
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
  return res.data;
};

/**
 * Hook to get all the published integrations ids
 */
export function useGetAllIntegrationsIds(enabler?: boolean, offset?: number) {
  return useQuery([INTEGRATIONS_KEY, 'ids'], () => getAllIntegrationsIds(offset), {
    enabled: !!enabler,
    keepPreviousData: true,
    onError: (err: Error) => logError('useIntegrationRegistry.getAllIntegrationsIds', err),
  });
}

const getAllIntegrationReleaseIds = async (integrationName: string, offset?: number) => {
  const sdk = getSDK();
  const res = await sdk.api.icRegistry.getAllIntegrationReleaseIds(integrationName, offset);
  return res.data;
};

/**
 * Hook to get all the release ids for an integration
 * @param integrationName - name of the integration
 * @param offset - offset to start from
 */
export function useGetAllIntegrationReleaseIds(integrationName: string, offset?: number) {
  return useQuery(
    [RELEASES_KEY, 'ids'],
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
 * @param releaseId - id of the integration
 */
export function useGetIntegrationReleaseInfo(releaseId: string) {
  return useQuery([RELEASES_KEY, releaseId], () => getIntegrationReleaseInfo(releaseId), {
    enabled: !!releaseId,
    keepPreviousData: false,
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
 * @param releaseIds - ids of the integrations
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
  return res.data;
};

/**
 * Hook to get latest release info for integrations
 * @param opt - array of integration names or ids
 */
export function useGetLatestReleaseInfo(opt: { name?: string; id?: string }[]) {
  return useQuery([RELEASES_KEY, 'latest'], () => getLatestReleaseInfo(opt), {
    enabled: opt?.length > 0,
    keepPreviousData: false,
    onError: (err: Error) => logError('useIntegrationRegistry.getLatestReleaseInfo', err),
  });
}
