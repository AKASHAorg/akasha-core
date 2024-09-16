import { ExtensionActivityFn } from '@akashaorg/typings/lib/ui';
import { pathToActiveWhen } from 'single-spa';
import { DeepTarget } from '../type-utils';
import { GetAppsByPublisherDidQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

export const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

export const stringToRegExp = (str: string) => {
  const wildcard = str.split(/\*+/).map(escapeRegExp).join('.*');
  return new RegExp(`^${wildcard}$`);
};

export const checkActivity = (
  activeWhen: string | ExtensionActivityFn,
  location: Location,
): boolean => {
  if (typeof activeWhen === 'string') {
    return pathToActiveWhen(activeWhen)(location);
  }
  if (typeof activeWhen === 'function') {
    return activeWhen(location, (path, exact) => pathToActiveWhen(path, exact)(location));
  }
};

export type AkashaAppEdgeNode = DeepTarget<
  GetAppsByPublisherDidQuery,
  ['node', 'akashaAppList', 'edges', 0, 'node']
>;

export const selectLatestRelease = (extensionData: AkashaAppEdgeNode) => {
  if (extensionData.releasesCount > 0) {
    const sortedReleases = extensionData.releases.edges.slice().sort((a, b) => {
      return Date.parse(b.node.createdAt) - Date.parse(a.node.createdAt);
    });
    return sortedReleases[0];
  }
};
