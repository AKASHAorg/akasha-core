import {
  ExtensionPointDefinition,
  IAppConfig,
  IWidgetConfig,
  UIEventData,
  WidgetRegistryInfo,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import * as singleSpa from 'single-spa';
import { IntegrationModule } from './apps';
import BaseIntegration, { BaseIntegrationClassOptions } from './base-integration';
import { navigateToModal, parseQueryString } from './utils';

class Widgets extends BaseIntegration {
  private readonly widgetInfos: WidgetRegistryInfo[];
  private readonly widgetModules: Record<string, IntegrationModule>;
  private readonly widgetConfigs: Record<string, IWidgetConfig>;
  private readonly widgetParcels: Record<string, singleSpa.Parcel>;
  private getAppRoutes: (appId: string) => IAppConfig['routes'];

  constructor(
    opts: BaseIntegrationClassOptions & {
      getAppRoutes: (appId: string) => IAppConfig['routes'];
    },
  ) {
    super(opts);
    this.widgetInfos = [];
    this.widgetModules = {};
    this.widgetConfigs = {};
    this.widgetParcels = {};
    this.layoutConfig = opts.layoutConfig;
    this.getAppRoutes = opts.getAppRoutes;
  }
  add(integration: WidgetRegistryInfo) {
    // todo
    this.widgetInfos.push(integration);
  }
  async import() {
    const importPromise = this.widgetInfos.map(async info => {
      try {
        this.widgetModules[info.name] = await System.import<IntegrationModule>(info.name);
      } catch (err) {
        this.logger.error(`Cannot import module: ${info.name} => error: ${err}`);
        // do not throw errors since this error
        // is specific to this integrations
        return Promise.resolve();
      }
    });
    await Promise.all(importPromise);
  }
  public onExtensionPointMount(extensionData?: UIEventData['data']) {
    const toLoad = this.filterWidgetsByMountPoint(
      this.widgetInfos,
      this.widgetConfigs,
      this.widgetParcels,
      extensionData,
    );
    toLoad.forEach(widgetInfo => {
      this.registerWidget(widgetInfo.name);
    });
  }
  public async onExtensionPointUnmount(extensionData?: UIEventData['data']) {
    const toUnload = this.filterWidgetsByMountPoint(
      this.widgetInfos,
      this.widgetConfigs,
      {}, // match every widget regardless if it's loaded on not
      extensionData,
    );
    for (const widgetInfo of toUnload) {
      await this.widgetParcels[widgetInfo.name].unmount();
      delete this.widgetParcels[widgetInfo.name];
    }
  }
  async registerWidget(widgetName: string) {
    const widgetConfig: IWidgetConfig = this.widgetConfigs[widgetName];
    if (this.isMobile && widgetConfig.notOnMobile) {
      this.logger.info(`will not display widget ** ${widgetConfig.name} ** on mobile`);
      return;
    }
    this.logger.info(
      `[@akashaproject/sdk-ui-plugin-loader] registering widget ${widgetConfig.name}`,
    );
    if (!this.layoutConfig) {
      this.logger.warn('Layout config is undefined!');
      return;
    }

    const wrapperNode = this.getDomElement(widgetConfig, widgetName, 'widget');

    if (!wrapperNode) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { loadingFn, title, mountsIn, ...otherLayoutProps } = this.layoutConfig;
    const widgetProps = {
      ...this.worldConfig,
      ...widgetConfig,
      layoutConfig: { ...otherLayoutProps },
      domElement: wrapperNode,
      globalChannel: this.sdk.api.globalChannel,
      uiEvents: this.uiEvents,
      isMobile: this.isMobile,
      logger: this.sdk.services.log.create(widgetName),
      // installIntegration: this.installIntegration.bind(this),
      // uninstallIntegration: this.uninstallIntegration.bind(this),
      navigateToModal: navigateToModal,
      getMenuItems: this.getMenuItems,
      getAppRoutes: this.getAppRoutes,
      navigateTo: this.navigateTo,
      parseQueryString: parseQueryString,
    };

    const widgetParcel = singleSpa.mountRootParcel(widgetConfig.loadingFn, widgetProps);
    this.widgetParcels[widgetName] = widgetParcel;
    return widgetParcel.mountPromise;
  }
  async importConfigs() {
    for (const name in this.widgetModules) {
      const widgetModule = this.widgetModules[name];

      if (widgetModule.hasOwnProperty('register') && typeof widgetModule.register === 'function') {
        this.widgetConfigs[name] = (await widgetModule.register({
          layoutConfig: this.layoutConfig,
          uiEvents: this.uiEvents,
          worldConfig: {
            title: this.worldConfig.title,
          },
          isMobile: this.isMobile,
        })) as IWidgetConfig;
      } else {
        this.logger.warn(`Widget ${name} does not have a register() method exported!`);
      }
    }
    return Promise.resolve();
  }
  public getExtensions() {
    return this.widgetInfos
      .filter(info => {
        const config = this.widgetConfigs[info.name];
        if (!config) {
          return false;
        }
        return !!config.extends && config.extends.length > 0;
      })
      .reduce((acc: ExtensionPointDefinition[], appInfo) => {
        const widgetConfig = this.widgetConfigs[appInfo.name];
        if (widgetConfig.extends && widgetConfig.extends.length) {
          const extensions = widgetConfig.extends.map(ext => {
            if (!ext.parentApp) {
              return {
                ...ext,
                parentApp: appInfo.name,
              };
            }
            return ext;
          });
          acc = acc.concat(extensions);
        }
        return acc;
      }, []);
  }
  public async install(widgetInfo: WidgetRegistryInfo) {
    const module = await System.import<IntegrationModule>(widgetInfo.name);
    if (!module) {
      this.logger.warn(`cannot import module: ${widgetInfo.name}`);
      return;
    }

    this.widgetModules[widgetInfo.name] = module;
    if (module.hasOwnProperty('install') && typeof module.install === 'function') {
      await module.install();
    }
    if (module.hasOwnProperty('register') && typeof module.register === 'function') {
      const widgetConfig = (await module.register({
        layoutConfig: this.layoutConfig,
        worldConfig: {
          title: this.worldConfig.title,
        },
        uiEvents: this.uiEvents,
        isMobile: this.isMobile,
      })) as IWidgetConfig;
      if (!widgetConfig) {
        return;
      }
      this.widgetConfigs[widgetInfo.name] = widgetConfig;
      await this.registerWidget(widgetConfig.name);
    } else {
      this.logger.warn(`App ${widgetInfo.name} has no exported .register() function!`);
    }
  }
  public uninstall(info: WidgetRegistryInfo) {
    const idx = this.widgetInfos.findIndex(inf => inf.name === info.name);
    if (idx >= 0) {
      // const call = this.sdk.services.db.apps.remove({ name: info.name });
      // call.subscribe({
      //   next: async (resp: { data: string[] | string }) => {
      //     if (resp.data) {
      //       delete this.widgetModules[info.name];
      //       this.widgetInfos.splice(idx, 1);
      //       if (this.widgetParcels[info.name]) {
      //         const parcel = this.widgetParcels[info.name];
      //         await parcel.unmount();
      //       }
      //       // if (this.extensionParcels.hasOwnProperty(name)) {
      //       //   this.extensionParcels[name].forEach(async parcelData => {
      //       //     await parcelData.parcel.unmount();
      //       //   });
      //       // }å
      //       this.logger.info(`app ${name} unloaded!`);
      //     }
      //   },
      //   error: (err: Error) => this.logger.error(`Error uninstalling app: ${name}, ${err}`),
      // });
    }
  }
  get configs() {
    return this.widgetConfigs;
  }
  get infos() {
    return this.widgetInfos;
  }
}

export default Widgets;
