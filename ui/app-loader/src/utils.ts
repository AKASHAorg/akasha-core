import {
  BaseIntegrationInfo,
  ExtensionPointDefinition,
  IAppConfig,
  ModalNavigationOptions,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import * as singleSpa from 'single-spa';
import qs from 'qs';
import { NavigationFn, NavigationOptions, QueryStringType } from '@akashaproject/ui-awf-typings';
import { of } from 'rxjs';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';

export const checkActivityFn = (
  config: IAppConfig | ExtensionPointDefinition,
  manifest?: BaseIntegrationInfo,
  location?: Location,
) => {
  if (!location) {
    location = window.location;
  }
  if (manifest && manifest.hasOwnProperty('enabled') && manifest.enabled === false) {
    return false;
  }
  if (config.hasOwnProperty('activeWhen') && typeof config.activeWhen === 'function') {
    return config.activeWhen(location, singleSpa.pathToActiveWhen);
  }
  return true;
};

export const getModalFromParams = (location: Location) => () => {
  const { search } = location;
  try {
    const searchObj = qs.parse(search, {
      ignoreQueryPrefix: true,
    }) as { modal: ModalNavigationOptions } | undefined;

    if (searchObj.modal) {
      return of({
        ...searchObj.modal,
      });
    }
    return of({ name: null });
  } catch (err) {
    console.error(`[getModalFromParams]:`, err);
    return of({ name: null });
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
  parent.append(wrapNode);
  return wrapNode;
};

export const navigateTo = (
  appConfigs: Map<string, IAppConfig & { name: string }>,
  logger: ILogger,
) => {
  return (options: string | NavigationOptions | NavigationFn) => {
    if (typeof options === 'string') {
      singleSpa.navigateToUrl(options);
    }
    let redirectQueryString = findKey('redirectTo', parseQueryString(location.search));

    if (typeof options === 'function') {
      singleSpa.navigateToUrl(options(qs.stringify, redirectQueryString));
    }
    if (typeof options === 'object') {
      const { queryStrings } = options;
      let appName = options.appName;
      if (typeof appName === 'function') {
        appName = appName(appConfigs);
      }

      const app = appConfigs.get(appName);
      if (!app) {
        logger.error(`Cannot find app name ${appName}. Make sure to specify the exact name!`);
        return;
      }

      let { pathName } = options;

      if (typeof pathName === 'function') {
        try {
          pathName = pathName(app.routes);
        } catch (err) {
          logger.error(
            `Path not found! Tried to find a path for application: ${appName}. Defaulting to rootRoute!`,
          );
        }
      }
      if (!pathName) {
        pathName = app.routes.rootRoute;
      }

      if (typeof queryStrings === 'function') {
        // allow to modify the redirect params
        redirectQueryString = queryStrings(qs.stringify, redirectQueryString);
      }
      const currentPath = location.pathname;
      const currentSearch = location.search;

      if (pathName === currentPath && redirectQueryString === currentSearch) {
        return;
      }
      singleSpa.navigateToUrl(`${pathName}${redirectQueryString ? `?${redirectQueryString}` : ''}`);
    }
  };
};

export const navigateToModal = (opts: ModalNavigationOptions) => {
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
      singleSpa.navigateToUrl(`${currentPath}?${searchStr}`);
      return;
    }
  }
  if (`${currentPath}?${str}` !== `${currentPath}${currentSearch}`) {
    singleSpa.navigateToUrl(`${currentPath}?${str}`);
  }
};

export const parseQueryString = (queryString: string): QueryStringType => {
  const query = qs.parse(queryString, { ignoreQueryPrefix: true });
  return query;
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

export const getDomElement = (integrationConfig: IAppConfig, name: string, logger: ILogger) => {
  const domNode = document.getElementById(integrationConfig.mountsIn || '');
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
