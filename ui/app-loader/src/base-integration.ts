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
import * as singleSpa from 'single-spa';
import { BehaviorSubject } from 'rxjs';
import { createRootNode } from './utils';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import { IAwfSDK } from '@akashaproject/sdk-typings';

export interface BaseIntegrationClassOptions {
  layoutConfig: LayoutConfig;
  uiEvents: BehaviorSubject<UIEventData>;
  worldConfig: ISdkConfig & ILoaderConfig;
  isMobile: boolean;
  sdk: IAwfSDK;
  addMenuItem: (menuItem: IMenuItem) => void;
  getMenuItems: () => IMenuList;
}

class BaseIntegration {
  public layoutConfig: LayoutConfig;
  public uiEvents: BehaviorSubject<UIEventData>;
  public worldConfig: ISdkConfig & ILoaderConfig;
  public sdk: IAwfSDK;
  public isMobile: boolean;
  public addMenuItem: (menuItem: IMenuItem) => void;
  public getMenuItems: () => IMenuList;
  public logger: ILogger;
  constructor(opts: BaseIntegrationClassOptions) {
    this.layoutConfig = opts.layoutConfig;
    this.uiEvents = opts.uiEvents;
    this.worldConfig = opts.worldConfig;
    this.sdk = opts.sdk;
    this.isMobile = opts.isMobile;
    this.addMenuItem = opts.addMenuItem;
    this.getMenuItems = opts.getMenuItems;
    this.logger = this.sdk.services.log.create('app-loader.base-integration');
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
      return this.logger.warn(`Node ${domNode} is undefined! App: ${name}`);
    }
    const rootNode = createRootNode(domNode, name, idPrefix);
    if (!rootNode) {
      return this.logger.warn(`Node ${rootNode} cannot be created! App: ${name}`);
    }
    return rootNode;
  }
}

export default BaseIntegration;
