import {
  AppOrWidgetDefinition,
  ModalNavigationOptions,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import * as singleSpa from 'single-spa';
import qs from 'qs';
import { QueryStringType, NavigationOptions } from '@akashaproject/ui-awf-typings';

export const getNameFromDef = (def: AppOrWidgetDefinition) => {
  if (typeof def === 'string') {
    return def;
  } else if (typeof def === 'object' && def.hasOwnProperty('name')) {
    return def.name;
  } else {
    return null;
  }
};

export const toNormalDef = (
  def: AppOrWidgetDefinition,
): { name: string; version: string } | null => {
  if (typeof def === 'string') {
    return {
      name: def,
      version: 'latest',
    };
  } else if (typeof def === 'object' && def.hasOwnProperty('name')) {
    if (def.hasOwnProperty('version')) {
      return def;
    }
    return { ...def, version: 'latest' };
  } else {
    return null;
  }
};

/* Create a new html div element and append it to a parent */
export const createRootNode = (
  parent: HTMLElement,
  nodeName: string,
  integrationType: 'app' | 'widget' | 'extension',
) => {
  if (!parent) {
    return null;
  }
  const nodeID = `${integrationType}-${nodeName.replace('@', '').replace('/', '-')}`;
  const node = document.querySelector(`#${parent.id} > #${nodeID}`);

  if (node) {
    return node as HTMLElement;
  }
  const wrapNode = document.createElement('div');
  wrapNode.id = `${nodeID}`;
  parent.append(wrapNode);
  return wrapNode;
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

export const navigateTo = (options: NavigationOptions) => {
  const { pathname, search } = options;
  const currentPath = location.pathname;
  const currentSearch = location.search;
  if (pathname === currentPath && qs.stringify(search) === currentSearch) {
    return;
  }
  singleSpa.navigateToUrl(`${pathname}?${qs.stringify(search)}`);
};

export const parseQueryString = (queryString: string): QueryStringType => {
  const query = qs.parse(queryString, { ignoreQueryPrefix: true });
  return query;
};
