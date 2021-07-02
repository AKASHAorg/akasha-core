import {
  AppRegistryInfo,
  IAppConfig,
  ILoaderConfig,
  IMenuItem,
  IMenuList,
  ISdkConfig,
  IWidgetConfig,
  LayoutConfig,
  UIEventData,
  WidgetRegistryInfo,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import pino from 'pino';
import * as singleSpa from 'single-spa';
import { BehaviorSubject } from 'rxjs';
import { createRootNode } from './utils';
import getSDK from '@akashaproject/awf-sdk';

export interface BaseIntegrationClassOptions {
  layoutConfig: LayoutConfig;
  uiEvents: BehaviorSubject<UIEventData>;
  worldConfig: ISdkConfig & ILoaderConfig;
  logger: pino.BaseLogger;
  isMobile?: boolean;
  sdk: ReturnType<typeof getSDK>;
  addMenuItem: (menuItem: IMenuItem) => void;
  getMenuItems: () => IMenuList;
}

class BaseIntegration {
  public layoutConfig: LayoutConfig;
  public uiEvents: BehaviorSubject<UIEventData>;
  public worldConfig: ISdkConfig & ILoaderConfig;
  public baseLogger: pino.BaseLogger;
  public sdk: ReturnType<typeof getSDK>;
  public addMenuItem: (menuItem: IMenuItem) => void;
  public getMenuItems: () => IMenuList;
  constructor(opts: BaseIntegrationClassOptions) {
    this.layoutConfig = opts.layoutConfig;
    this.uiEvents = opts.uiEvents;
    this.worldConfig = opts.worldConfig;
    this.baseLogger = opts.logger;
    this.sdk = opts.sdk;
    this.addMenuItem = opts.addMenuItem;
    this.getMenuItems = opts.getMenuItems;
  }
  public getAppsForLocation(location: Location) {
    return singleSpa.checkActivityFunctions(location);
  }
  public filterAppsByMountPoint(
    appInfos: AppRegistryInfo[],
    appConfigs: Record<string, IAppConfig>,
    extension?: UIEventData['data'],
  ) {
    if (!extension) {
      return [];
    }
    const extName = extension.name;
    const registeredApps = singleSpa.getAppNames();
    return appInfos.filter(appInfo => {
      const config = appConfigs[appInfo.name];
      if (!config) {
        return false;
      }
      return config.mountsIn === extName && !registeredApps.includes(appInfo.name);
    });
  }
  public filterWidgetsByMountPoint(
    widgetInfos: WidgetRegistryInfo[],
    widgetConfigs: Record<string, IWidgetConfig>,
    widgetParcels: Record<string, singleSpa.Parcel>,
    extension?: UIEventData['data'],
  ) {
    if (!extension) {
      return [];
    }
    const extName = extension.name;
    return widgetInfos.filter(widgetInfo => {
      const config = widgetConfigs[widgetInfo.name];
      if (!config) {
        return false;
      }
      return config.mountsIn === extName && !widgetParcels.hasOwnProperty(widgetInfo.name);
    });
  }
  public checkActivityFn(integrationConfig: IAppConfig | IWidgetConfig, location: Location) {
    if (
      integrationConfig.hasOwnProperty('activeWhen') &&
      typeof integrationConfig.activeWhen === 'function'
    ) {
      return integrationConfig.activeWhen(location, singleSpa.pathToActiveWhen);
    }
    return true;
  }
  public getDomElement(
    integrationConfig: IAppConfig | IWidgetConfig,
    name: string,
    idPrefix: 'app' | 'widget' | 'extension',
  ) {
    const domNode = document.getElementById(integrationConfig.mountsIn || '');
    if (!domNode) {
      return this.baseLogger
        .child({ module: 'base-integration' })
        .warn(`Node ${domNode} is undefined! App: ${name}`);
    }
    const rootNode = createRootNode(domNode, name, idPrefix);
    if (!rootNode) {
      return this.baseLogger
        .child({ module: 'base-integration' })
        .warn(`Node ${rootNode} cannot be created! App: ${name}`);
    }
    return rootNode;
  }
}

export default BaseIntegration;
