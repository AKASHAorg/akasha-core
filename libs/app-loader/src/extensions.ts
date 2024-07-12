import { WorldConfig } from '@akashaorg/typings/lib/ui';
import getSDK from '@akashaorg/awf-sdk';
import { SortOrder } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { ILogger } from '@akashaorg/typings/lib/sdk/log';

/**
 * Retrieves the latest version of a published app from the Akasha Registry.
 *
 * @param appName - The name of the app to retrieve.
 * @param logger - An optional logger instance to use for logging.
 * @returns The latest version of the app, including its source, version, ID, creation date, and manifest data.
 * @throws Error if the DID_PUBLISHER_PUBLIC_KEY environment variable is not defined.
 */
const getPublishedAppLatestVersion = async (appName: string, logger?: ILogger) => {
  const sdk = getSDK();
  //this will change to INDEXING_DID once we have the passive indexing feature
  const did = process.env?.DID_PUBLISHER_PUBLIC_KEY;
  const log = logger || console;
  if (!did) {
    throw new Error('DID_PUBLISHER_PUBLIC_KEY is not defined');
  }
  const app = await sdk.services.gql.client.GetAppsByPublisherDID(
    {
      id: did,
      first: 1,
      filters: { where: { name: { equalTo: appName } } },
      sorting: { createdAt: SortOrder.Desc },
    },
    { context: { source: sdk.services.gql.contextSources.default } },
  );
  if (!('akashaAppList' in app.node)) {
    log.warn(`An error occurred while fetching app ${appName}`);
    return;
  }
  const appNode = app?.node?.akashaAppList?.edges.length
    ? app?.node?.akashaAppList?.edges[0].node
    : undefined;

  if (!appNode.id) {
    log.warn(`No app found for publisher ${did} and name ${appName}`);
    return;
  }

  if (!appNode.releasesCount || !appNode.releases.edges.length) {
    log.warn(`No published versions found for app ${appName}`);
    return;
  }
  // const { source, version, id, createdAt } = appNode.releases.edges[0].node;

  return appNode;

  // @Todo: remove this
  /*{
    sources: sdk.services.common.ipfs.multiAddrToUri([source]),
    id,
    createdAt,
    name: appName,
    enabled: true,
    author: did,
    integrationID: id,
    integrationType: appNode.applicationType,
    manifestData: {
      version,
      description: appNode.description,
      displayName: appNode.displayName,
      keywords: appNode.keywords,
      license: appNode.license,
      contributors: appNode.contributors?.map(contributor => contributor.akashaProfile.did.id),
      mainFile: 'index.js',
    },
  };*/
};

export const getRemoteLatestExtensionInfos = async (extensions: { name: string }[]) => {
  const pkgInfos = [];
  for (const extension of extensions) {
    const app = await getPublishedAppLatestVersion(extension.name);
    if (app) {
      pkgInfos.push(app);
    }
  }
  return Promise.resolve(pkgInfos);
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
