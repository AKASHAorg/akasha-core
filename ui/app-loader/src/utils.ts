import { ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';
import * as singleSpa from 'single-spa';
import qs from 'qs';
import { QueryStringType } from '@akashaproject/ui-awf-typings';

export const getNameFromDef = (def: string) => {
  if (typeof def === 'string') {
    return def;
  } else {
    return null;
  }
};

export const toNormalDef = (def: string): { name: string; version?: string } | null => {
  if (typeof def === 'string') {
    return {
      name: def,
      version: 'latest',
    };
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
