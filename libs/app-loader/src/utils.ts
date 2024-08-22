import { IAppConfig, IModalNavigationOptions, IQueryString } from '@akashaorg/typings/lib/ui';
import * as singleSpa from 'single-spa';
import qs from 'qs';
import { Logger } from '@akashaorg/core-sdk';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export const encodeName = (appName: string) => {
  return appName;
};

export const decodeName = (appName: string) => {
  return decodeURIComponent(appName);
};

export interface CheckActivityOptions {
  config: IAppConfig;
  encodedAppName: string;
  // removed or reported
  enabled?: boolean;
  location?: Location;
  extensionType: AkashaAppApplicationType;
}

export const checkActivityFn = (opts: CheckActivityOptions): singleSpa.Activity => {
  const {
    config,
    extensionType,
    encodedAppName,
    enabled = true,
    location = window.location,
  } = opts;

  if (!enabled) {
    return () => false;
  }

  if (extensionType === AkashaAppApplicationType.App) {
    return `/${encodedAppName}`;
  }

  if (config.activeWhen) {
    if (typeof config.activeWhen === 'string') {
      return config.activeWhen;
    }
    if (Array.isArray(config.activeWhen)) {
      if (config.activeWhen.every(path => typeof path === 'string')) {
        return config.activeWhen;
      }
      return config.activeWhen.map(activity => {
        if (typeof activity === 'string') {
          return activity;
        }
        return providedLocation =>
          activity(location, (path, exact) =>
            singleSpa.pathToActiveWhen(path, exact)(providedLocation),
          );
      });
    }
  } else {
    // should default to true if:
    // extensionType is not APP
    // is enabled
    return () => true;
  }
};

export const getModalFromParams = (location: Location) => {
  const { search } = location;

  try {
    const searchObj = qs.parse(search, {
      ignoreQueryPrefix: true,
    }) as { modal: IModalNavigationOptions } | undefined;

    if (searchObj.modal) {
      return {
        ...searchObj.modal,
      };
    }

    return null;
  } catch (err) {
    return null;
  }
};

/* Create a new html div element and append it to a parent */
export const createRootNode = (parent: HTMLElement, nodeName: string) => {
  if (!parent) {
    return null;
  }
  const nodeID = `${nodeName.replace('@', '').replace('/', '-')}`;
  const node = document.querySelector(`#${parent.id} > #${nodeID}`);

  if (node) {
    return node as HTMLElement;
  }
  const wrapNode = document.createElement('div');
  wrapNode.id = `${nodeID}`;
  wrapNode.classList.add('global-styles__inherit-height', 'global-styles__inherit-width');
  parent.append(wrapNode);
  return wrapNode;
};

export const navigateToModal = (opts: IModalNavigationOptions) => {
  const currentPath = location.pathname;
  const currentSearch = location.search;
  const str = qs.stringify({ modal: opts });
  if (str === currentSearch) {
    return;
  }
  const currentSearchObj = qs.parse(currentSearch, { ignoreQueryPrefix: true });
  if (currentSearchObj.hasOwnProperty('modal')) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { modal, ...others } = currentSearchObj;
    if (Object.keys(others).length) {
      const searchStr = qs.stringify({ modal: str, ...others });
      const nextUrl = `${currentPath}?${searchStr}`;
      singleSpa.navigateToUrl(nextUrl);
      return;
    }
  }

  if (`${currentPath}?${str}` !== `${currentPath}${currentSearch}`) {
    const nextUrl = `${currentPath}?${str}`;
    singleSpa.navigateToUrl(nextUrl);
  }
};

export const parseQueryString = (queryString: string): IQueryString => {
  return qs.parse(queryString, { ignoreQueryPrefix: true });
};

/* find key in object recursively */
export const findKey = (key: string, obj: unknown): string | null => {
  if (typeof obj !== 'object') {
    return null;
  }

  if (obj.hasOwnProperty(key)) {
    return obj[key];
  }

  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      const result = findKey(key, obj[prop]);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export const getDomElement = (extensionConfig: IAppConfig, name: string, logger: Logger) => {
  const domNode = document.getElementById(extensionConfig.mountsIn || '');

  if (!domNode) {
    logger.warn(`Node ${domNode} is undefined! App: ${name}`);
    return null;
  }

  const rootNode = createRootNode(domNode, name);
  if (!rootNode) {
    logger.warn(`Node ${rootNode} cannot be created! App: ${name}`);
    return null;
  }
  return rootNode;
};
export const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

export const stringToRegExp = (str: string) => {
  const wildcard = str.split(/\*+/).map(escapeRegExp).join('.*');
  return new RegExp(`^${wildcard}$`);
};

export const extractAppNameFromPath = (path: string) => {
  let devName: string;
  let appName: string;
  if (path.startsWith('/')) {
    [, devName, appName] = path.split('/');
  } else {
    [devName, appName] = path.split('/');
  }
  if (devName.startsWith('@')) {
    return `${devName}/${appName}`;
  }
  return devName;
};
