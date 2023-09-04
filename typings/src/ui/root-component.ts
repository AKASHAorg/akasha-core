import singleSpa from 'single-spa';
import { IAppConfig } from './apps';
import { Subject } from 'rxjs';
import { UIEventData } from './ui-events';
import { AnalyticsEventData } from './analytics';
import { ModalNavigationOptions } from './navigation';
import i18n from 'i18next';
import { IPluginsMap } from './plugins';
import { WorldConfig, QueryStringType } from './app-loader';
import { ILogger } from '../sdk/log';

export interface RootComponentProps {
  activeWhen?: { path: string };
  domElement: HTMLElement;
  uiEvents: Subject<UIEventData | AnalyticsEventData>;
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
  extensionData: UIEventData['data'];
}

// @Todo: fix type
export interface UseRootComponentReturn extends RootComponentProps {
  getRoutingPlugin: (ns?: string) => any;
  getTranslationPlugin: (ns?: string) => any;
}
