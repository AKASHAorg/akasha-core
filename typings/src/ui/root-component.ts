import type singleSpa from 'single-spa';
import type { IAppConfig } from './apps';
import type { Subject } from 'rxjs';
import type { EventDataTypes, UIEventData } from './ui-events';
import type { AnalyticsEventData } from './analytics';
import type { ModalNavigationOptions } from './navigation';
import type i18n from 'i18next';
import type { IPluginsMap } from './plugins';
import type { WorldConfig, QueryStringType } from './app-loader';
import type { ILogger } from '../sdk/log';

export interface RootComponentProps {
  activeWhen?: { path: string };
  domElement: HTMLElement;
  uiEvents: Subject<Extract<UIEventData, { event: UIEventData['event'] }> | AnalyticsEventData>;
  i18next?: typeof i18n;
  plugins?: Record<string, IPluginsMap>;
  layoutConfig: IAppConfig['extensions'];
  logger: ILogger;
  name?: string;
  singleSpa: typeof singleSpa;
  baseRouteName: string;
  navigateToModal: (opts: ModalNavigationOptions) => void;
  getAppRoutes?: (appId: string) => IAppConfig['routes'];
  worldConfig: WorldConfig;
  parseQueryString: (queryString: string) => QueryStringType;
  encodeAppName: (name: string) => string;
  decodeAppName: (name: string) => string;
  children?: React.ReactNode;
}

export interface RootExtensionProps extends RootComponentProps {
  extensionData: EventDataTypes;
}

// @Todo: fix type
export interface UseRootComponentReturn extends RootComponentProps {
  getRoutingPlugin: (ns?: string) => any;
  getTranslationPlugin: (ns?: string) => any;
}
