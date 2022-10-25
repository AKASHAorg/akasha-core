import singleSpa from 'single-spa';
import { IAppConfig } from './apps';
import { Subject } from 'rxjs';
import { UIEventData } from './ui-events';
import { AnalyticsEventData } from './analytics';
import { ModalNavigationOptions } from './navigation';
import i18n from 'i18next';
import { IPluginsMap } from './plugins';
import { ILoaderConfig, QueryStringType } from './app-loader';
import { Logger } from 'pino';

export interface RootComponentProps {
  activeWhen?: { path: string };
  domElement: HTMLElement;
  uiEvents: Subject<UIEventData | AnalyticsEventData>;
  i18next?: typeof i18n;
  plugins?: Record<string, IPluginsMap>;
  layoutConfig: IAppConfig['extensions'];
  logger: Logger;
  name?: string;
  singleSpa: typeof singleSpa;
  baseRouteName: string;
  /*
   * @deprecated
   */
  installIntegration?: (name: string) => void;
  /*
   * @deprecated
   */
  uninstallIntegration?: (name: string) => void;
  navigateToModal: (opts: ModalNavigationOptions) => void;
  getAppRoutes?: (appId: string) => IAppConfig['routes'];
  worldConfig: ILoaderConfig;
  parseQueryString: (queryString: string) => QueryStringType;
  encodeAppName: (name: string) => string;
  decodeAppName: (name: string) => string;
}

export interface RootExtensionProps extends RootComponentProps {
  extensionData: UIEventData['data'];
}
