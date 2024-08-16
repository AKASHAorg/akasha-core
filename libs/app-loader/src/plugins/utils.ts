import { ExtensionActivityFn } from '@akashaorg/typings/lib/ui';
import { pathToActiveWhen } from 'single-spa';

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
