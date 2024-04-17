import React from 'react';
import type singleSpa from 'single-spa';
import type { IAppConfig } from './apps';
import type { Subject } from 'rxjs';
import type { UIEventData } from './ui-events';
import type { ModalNavigationOptions } from './navigation';
import type i18n from 'i18next';
import type { IPluginsMap } from './plugins';
import type { WorldConfig, QueryStringType, LayoutConfig } from './app-loader';
import type { ILogger } from '../sdk/log';

export interface RootComponentProps {
  activeWhen?: { path: string };
  domElement?: HTMLElement;
  domElementGetter?: () => HTMLElement;
  uiEvents: Subject<UIEventData>;
  i18next?: typeof i18n;
  plugins?: Record<string, IPluginsMap>;
  layoutConfig: LayoutConfig;
  logger: ILogger;
  name?: string;
  singleSpa: typeof singleSpa;
  baseRouteName: string;
  navigateToModal: (opts: ModalNavigationOptions) => void;
  getModalFromParams: (location: Location) => { name: string; message?: string; title?: string };
  getAppRoutes?: (appId: string) => IAppConfig['routes'];
  worldConfig: WorldConfig;
  parseQueryString: (queryString: string) => QueryStringType;
  encodeAppName: (name: string) => string;
  decodeAppName: (name: string) => string;
  children?: React.ReactNode;
}

export interface RootExtensionProps<D = Record<string, unknown>> extends RootComponentProps {
  extensionData: D;
}
