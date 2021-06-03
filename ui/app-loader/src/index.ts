import {
  EventTypes,
  ILoaderConfig,
  ISdkConfig,
  IntegrationConfig,
  AppOrWidgetDefinition,
  IAppConfig,
  IWidgetConfig,
  LayoutConfig,
  AppRegistryInfo,
  WidgetRegistryInfo,
  UIEventData,
  ExtensionPointDefinition,
  ModalNavigationOptions,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

import pino from 'pino';
import { BehaviorSubject } from 'rxjs';
import * as rxjsOperators from 'rxjs/operators';
import * as singleSpa from 'single-spa';
import { createImportMap, getCurrentImportMaps, writeImports } from './import-maps';
import { getIntegrationInfos } from './registry';
import { hideSplash, showSplash } from './splash-screen';
import detectMobile from 'ismobilejs';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { getNameFromDef, toNormalDef } from './utils';
import qs from 'qs';

// import { setPageTitle } from './setPageMetadata';

// import { pathToRegexp } from 'path-to-regexp';

export interface IAppLoader {
  registerApp(name: string): Promise<void>;

  registerWidget(name: string): Promise<null | undefined>;
}

// note: app-center will run the app lifecycles

interface SingleSpaEventDetail {
  originalEvent: Event;
  newAppStatuses: {
    [key: string]: string;
  };
  appsByNewStatus: {
    MOUNTED: string[];
    NOT_MOUNTED: string[];
  };
  totalAppChanges: number;
}

interface SdkChannels {
  [key: string]: Record<string, any>;
}

export default class AppLoader implements IAppLoader {
  public readonly uiEvents: BehaviorSubject<UIEventData>;
  /**
   * World configuration object. Used to set necessary endpoints, default loaded apps and widgets.
   */
  private readonly worldConfig: ILoaderConfig & ISdkConfig;
  private readonly logger: pino.BaseLogger;
  private readonly loaderLogger: pino.Logger;
  private readonly sdk;
  public integrations: {
    info: (AppRegistryInfo | WidgetRegistryInfo)[];
    modules: Record<string, IntegrationConfig>;
  };
  public layoutConfig?: LayoutConfig;
  private readonly isMobile: boolean;
  private widgetParcels: Map<string, singleSpa.Parcel>;
  private extensionPoints: UIEventData['data'][];
  private extensionParcels: Record<string, { id: string; parcel: singleSpa.Parcel }[]>;
  private activeModal?: ModalNavigationOptions;
  constructor(worldConfig: ILoaderConfig & ISdkConfig, sdk: SdkChannels) {
    this.worldConfig = worldConfig;
    this.logger = pino({ browser: { asObject: true }, level: worldConfig.logLevel });
    this.loaderLogger = this.logger.child({ module: 'app-loader' });
    this.sdk = sdk;
    this.isMobile = detectMobile().phone || detectMobile().tablet;
    this.integrations = {
      info: [],
      modules: {},
    };
    this.uiEvents = new BehaviorSubject({ event: EventTypes.Instantiated });
    this.widgetParcels = new Map();
    // register event listeners
    this.addSingleSpaEventListeners();
    this.watchSignIn();
    this.extensionPoints = [];
    this.extensionParcels = {};
  }
  private watchSignIn() {
    if (this.sdk.globalChannel) {
      const loginEvent = this.sdk.globalChannel.pipe(
        rxjsOperators.filter(
          (ev: { channelInfo: Record<string, unknown>; data: Record<string, unknown> }) =>
            ev?.channelInfo?.method === 'signIn',
        ),
      );
      loginEvent.subscribe({
        next: () => {
          this.getUserApps();
        },
        error: (err: Error) => this.loaderLogger.error(`${err}`),
      });
    }
  }
  public getUserApps() {
    if (!this.sdk) {
      return;
    }
    const doc = this.sdk.db.apps.getInstalled({});
    doc.subscribe({
      next: async (resp: { data: { apps: AppOrWidgetDefinition[] } }) => {
        const { data } = resp;
        this.loaderLogger.info('currently installed apps %o', data.apps);
        if (!data.apps.length) {
          return;
        }
        if (data.apps.length) {
          const appsToLoad = data.apps.filter(app => {
            const appName = getNameFromDef(app);
            if (!appName) {
              return;
            }
            return !this.integrations.info.some(int => int.name === appName);
          });
          if (!appsToLoad.length) {
            return;
          }
          const infos = await this.getIntegrationsInfo(appsToLoad);
          await this.loadModules(infos, 'user-installed-integrations');
          await this.importIntegrationConfigs(infos);
          await this.loadIntegrations(infos);
          infos.forEach(async info => {
            await this.tryMountExtensions(this.integrations.modules[info.name], info);
          });
        }
      },
      error: (err: Error) => {
        this.loaderLogger.error(`Failed to get user installed apps. Error: ${err}`);
      },
    });
  }

  public async start(): Promise<void> {
    showSplash();
    // call as fast as possible
    // https://github.com/single-spa/single-spa/issues/484
    singleSpa.start({
      urlRerouteOnly: true,
    });
    const integrationInfos = await this.getIntegrationsInfo([
      this.worldConfig.homepageApp,
      this.worldConfig.layout,
      ...this.worldConfig.defaultApps,
      ...this.worldConfig.defaultWidgets,
    ]);
    await this.loadModules(integrationInfos, 'default-world-integrations');

    this.uiEvents.subscribe(eventData => {
      if (typeof eventData === 'object' && eventData.event) {
        if (eventData.event === EventTypes.ExtensionPointMount) {
          this.onExtensionPointMount(eventData.data);
        }
        if (eventData.event === EventTypes.ExtensionPointUnmount) {
          this.onExtensionPointUnmount(eventData.data);
        }
        if (eventData.event === EventTypes.ModalMount) {
          this.onModalMount(eventData.data);
        }
        if (eventData.event === EventTypes.ModalUnmount) {
          this.onModalUnmount(eventData.data);
        }
      }
    });

    await this.importLayoutConfig();
    await this.importIntegrationConfigs(this.integrations.info);
    await this.loadLayout();
  }

  public filterByMountPoint(
    integrations: (AppRegistryInfo | WidgetRegistryInfo)[],
    extension?: UIEventData['data'],
  ) {
    if (!extension) {
      return [];
    }
    const extName = extension.name;
    const registeredApps = singleSpa.getAppNames();
    const registeredWidgets = Object.keys(this.widgetParcels);
    return integrations.filter(integration => {
      const config = this.integrations.modules[integration.name];
      if (!config) {
        return false;
      }
      return (
        config.mountsIn === extName &&
        ![...registeredApps, ...registeredWidgets].includes(integration.name)
      );
    });
  }

  public async onModalMount(modalData: UIEventData['data']) {
    console.log('modal mounted!>>>', modalData);
    this.activeModal = modalData;
  }
  public async onModalUnmount(modalData: UIEventData['data']) {
    console.log('modal unmounted! >>>>>', modalData);
    this.activeModal = undefined;
  }

  public async onExtensionPointMount(extensionData?: UIEventData['data']) {
    console.log('filter integrations based on extention point =>', extensionData);
    const layoutName = getNameFromDef(this.worldConfig.layout);
    if (!layoutName) {
      this.loaderLogger.warn(`Layout name is misconfigured!`);
      return;
    }

    if (extensionData) {
      this.extensionPoints.push(extensionData);
    }

    const filtered = this.integrations.info.filter(integration => {
      return integration.name !== layoutName;
    });
    const toLoad = this.filterByMountPoint(filtered, extensionData);
    await this.loadIntegrations(toLoad);
  }

  public async onExtensionPointUnmount(extensionData?: { name: string }) {
    console.log('extension unmounting!', extensionData);
    if (!extensionData || extensionData.name) {
      return;
    }
    const extPoint = this.extensionPoints.find(
      extPoint => extPoint && extPoint.name === extensionData.name,
    );
    if (extPoint) {
      console.log('extension point is unmounting!', extPoint);
    }
  }

  public async getIntegrationsInfo(modules: AppOrWidgetDefinition[]) {
    const moduleDefinitions = modules
      .map(def => {
        const normalized = toNormalDef(def);
        if (!normalized) {
          this.loaderLogger.warn(`Error in configuration of ${def}`);
          return null;
        }
        return normalized;
      })
      .filter(m => m !== null) as NonNullable<{ name: string; version: string }[]>;
    if (!moduleDefinitions) {
      this.loaderLogger.warn(`There is a misconfiguration in app definitions!`);
      return [];
    }
    if (Array.isArray(moduleDefinitions)) {
      return await getIntegrationInfos(moduleDefinitions);
    }
    return [];
  }

  /**
   * Get the infos about the apps and register them into systemjs
   */
  public async loadModules(infos: (AppRegistryInfo | WidgetRegistryInfo)[], scriptId: string) {
    const currentImportMap = getCurrentImportMaps();

    if (!currentImportMap) {
      this.loaderLogger.warn('Import-maps script element was not found! Stopping!');
      return;
    }
    const newMap = createImportMap(infos);
    writeImports(newMap, scriptId);
    await (System as typeof System & {
      prepareImport: (doProcessScripts?: boolean) => Promise<void>;
    }).prepareImport(true);
    if (this.integrations.info.length) {
      infos.forEach(int => {
        this.integrations.info.push(int);
      });
    } else {
      this.integrations.info = infos;
    }
  }

  public async importLayoutConfig() {
    const layoutApp = getNameFromDef(this.worldConfig.layout);
    if (!layoutApp) {
      this.loaderLogger.error('Layout widget/app was not found!');
      return;
    }

    const layoutInfo = this.integrations.info.find(integration => integration.name === layoutApp);

    if (layoutInfo) {
      const mod = await System.import(layoutInfo.name);
      this.integrations.modules[layoutInfo.name] = mod.register({
        worldConfig: {
          title: this.worldConfig.title,
        },
        integrations: this.integrations,
      });
      this.layoutConfig = this.integrations.modules[layoutInfo.name] as LayoutConfig;
    } else {
      return this.loaderLogger.error('Configuration or module for layout app/widget not found!');
    }
  }
  /**
   * imports the apps and widgets
   */
  public async importIntegrationConfigs(integrations: (AppRegistryInfo | WidgetRegistryInfo)[]) {
    const importPromise = integrations.map(async info => {
      try {
        const mod = await System.import(info.name);
        if (mod.hasOwnProperty('register') && typeof mod.register === 'function') {
          this.integrations.modules[info.name] = mod.register({
            layoutConfig: this.layoutConfig,
            uiEvents: this.uiEvents,
            worldConfig: {
              title: this.worldConfig.title,
            },
            integrations: this.integrations,
          });
        } else {
          this.loaderLogger.warn(
            `Integration ${info.name} does not have a register() method exported!`,
          );
        }
        return Promise.resolve();
      } catch (err) {
        throw new Error(`Cannot import module: ${info.name} => error: ${err}`);
      }
    });

    return await Promise.all(importPromise);
  }

  public async loadIntegrations(integrations: (AppRegistryInfo | WidgetRegistryInfo)[]) {
    integrations.forEach(async integration => {
      if (integration.type === 'app') {
        await this.registerApp(integration.name);
      } else if (integration.type === 'widget') {
        await this.registerWidget(integration.name);
      } else {
        this.loaderLogger.warn('integration type is unknown');
      }
    });
  }

  public async loadLayout() {
    if (!this.layoutConfig) {
      this.loaderLogger.warn('Layout config is undefined!');
      return;
    }

    const domEl = document.getElementById(this.layoutConfig.mountsIn || '');

    if (!domEl) {
      this.loaderLogger.error(
        `Cannot load layout since the dom element ${this.layoutConfig.mountsIn} was not found!`,
      );
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { loadingFn, mountsIn, title, name, ...layoutParams } = this.layoutConfig;

    const layoutParcel = singleSpa.mountRootParcel<
      RootComponentProps & { domElement: HTMLElement }
    >(this.layoutConfig.loadingFn, {
      domElement: domEl,
      uiEvents: this.uiEvents,
      singleSpa: singleSpa,
      isMobile: this.isMobile,
      globalChannel: this.sdk.globalChannel,
      rxjsOperators: rxjsOperators,
      layoutConfig: { ...layoutParams },
      logger: this.logger.child({ module: this.layoutConfig.name }),
      sdkModules: this.getDependencies(this.layoutConfig, this.layoutConfig.name),
      mountParcel: singleSpa.mountRootParcel,
      name: this.layoutConfig.name,
      navigateToModal: this.navigateToModal.bind(this),
    });
    return layoutParcel.mountPromise;
  }

  public async installIntegration(name: AppOrWidgetDefinition) {
    // todo
    const appDefinition = toNormalDef(name);
    if (!appDefinition) {
      this.loaderLogger.warn(
        `Misconfiguration of ${name}. It should be a string or object of type: {name: string; version: string}`,
      );
      return;
    }

    const infos = await this.getIntegrationsInfo([appDefinition]);
    await this.loadModules(infos, `user-installed-${appDefinition.name}`);
    await this.importIntegrationConfigs(infos);

    // save to db;
    const sub = this.sdk.db.apps.install({
      name: appDefinition.name,
      version: appDefinition.version,
    });

    sub.subscribe({
      next: async (data: unknown) => {
        if (data) {
          this.loaderLogger.info(`app ${appDefinition.name} installed.`);
          await this.loadIntegrations(infos);
          const config = this.integrations.modules[appDefinition.name];
          this.tryMountExtensions(config, infos[0]);
        }
      },
      error: (err: Error) => {
        this.loaderLogger.error(`cannot install ${appDefinition.name}. ${err}`);
      },
    });
  }

  private tryMountExtensions(
    appConfig: IAppConfig | IWidgetConfig,
    appInfo: AppRegistryInfo | WidgetRegistryInfo,
  ) {
    if (!appConfig.extends || !appConfig.extends.length) {
      return;
    }
    appConfig.extends.forEach((extension: ExtensionPointDefinition, index: number) => {
      if (this.extensionPoints.some(ext => ext && ext.name === extension.mountsIn)) {
        this.mountExtensionPoint(extension, appInfo.name, index);
      }
    });
  }

  private async mountExtensionPoint(
    extensionPoint: ExtensionPointDefinition,
    appName: string,
    index: number,
  ) {
    if (extensionPoint.mountsIn) {
      const node = document.getElementById(extensionPoint.mountsIn);
      if (node) {
        const extensionProps = {
          domElement: node,
          singleSpa,
          extension: extensionPoint,
        };

        const extensionParcel = singleSpa.mountRootParcel(extensionPoint.loadingFn, extensionProps);

        const parcelData = {
          id: `${extensionPoint.mountsIn}-${index}`,
          parcel: extensionParcel,
        };

        if (!this.extensionParcels[appName]) {
          this.extensionParcels[appName] = [parcelData];
        } else {
          this.extensionParcels[appName].push(parcelData);
        }
        await extensionParcel.mountPromise;
      }
    }
  }

  public async uninstallIntegration(name: string) {
    const idx = this.integrations.info.findIndex(int => int.name === name);
    if (idx >= 0) {
      const info = this.integrations.info[idx];
      const call = this.sdk.db.apps.remove({ name });
      call.subscribe({
        next: async (resp: { data: string[] | string }) => {
          if (resp.data) {
            delete this.integrations.modules[name];
            this.integrations.info.splice(idx, 1);
            if (info.type === 'app') {
              const registered = singleSpa.getAppNames();
              if (registered.includes(name)) {
                await singleSpa.unloadApplication(name);
                await singleSpa.unregisterApplication(name);
              }
            }
            if (info.type === 'widget' && this.widgetParcels.get(name)) {
              const parcel = this.widgetParcels.get(name);
              if (parcel) {
                await parcel.unmount();
              }
            }
            if (this.extensionParcels.hasOwnProperty(name)) {
              this.extensionParcels[name].forEach(async parcelData => {
                await parcelData.parcel.unmount();
              });
            }
            this.loaderLogger.info(`app ${name} unloaded!`);
          }
        },
        error: (err: Error) => this.loaderLogger.error(`Error uninstalling app: ${name}, ${err}`),
      });
    }
  }

  private addSingleSpaEventListeners() {
    window.addEventListener('single-spa:first-mount', this.onFirstMount.bind(this));
    window.addEventListener('single-spa:before-routing-event', this.beforeRouting.bind(this));
    window.addEventListener('single-spa:app-change', this.onAppChange.bind(this));
    window.addEventListener('single-spa:routing-event', this.onRouting.bind(this));
  }
  private checkActivityFn(integrationConfig: IAppConfig | IWidgetConfig, location: Location) {
    if (
      integrationConfig.hasOwnProperty('activeWhen') &&
      typeof integrationConfig.activeWhen === 'function'
    ) {
      return integrationConfig.activeWhen(location, singleSpa.pathToActiveWhen);
    }
    return true;
  }
  /**
   * register an app
   * using this method we define the default
   * (uninstallable) plugins and apps
   */
  public async registerApp(appName: string) {
    const registeredApps = singleSpa.getAppNames();
    if (registeredApps.some(app => app === appName)) {
      this.loaderLogger.info(`App ${appName} already registered`);
      return;
    }

    const appConfig = this.integrations.modules[appName];
    if (!appConfig) {
      this.loaderLogger.warn(`there is no module with the name: ${appName}`);
      return;
    }

    this.loaderLogger.info(`registering app ${appName}`);

    const deps = this.getDependencies(appConfig, appName);

    if (appConfig.mountsIn) {
      singleSpa.registerApplication({
        name: appName,
        app: appConfig.loadingFn,
        activeWhen: location => this.checkActivityFn(appConfig, location),
        customProps: {
          domElement: document.getElementById(appConfig.mountsIn),
          sdkModules: deps,
          rxjsOperators: rxjsOperators,
          uiEvents: this.uiEvents,
          logger: this.logger.child({ module: appName }),
          installIntegration: this.installIntegration.bind(this),
          uninstallIntegration: this.uninstallIntegration.bind(this),
          navigateToModal: this.navigateToModal.bind(this),
          layoutConfig: this.layoutConfig,
          globalChannel: this.sdk.globalChannel,
        },
      });
    } else {
      this.loaderLogger.warn(
        'Cannot mount %s since there is not mountsIn property defined!',
        appName,
      );
    }
  }

  public async registerWidget(widgetName: string) {
    const widgetConfig: IWidgetConfig = this.integrations.modules[widgetName];
    if (this.isMobile && widgetConfig.notOnMobile) {
      this.loaderLogger.info(`will not display widget ** ${widgetConfig.name} ** on mobile`);
      return;
    }
    this.loaderLogger.info(
      `[@akashaproject/sdk-ui-plugin-loader] registering widget ${widgetConfig.name}`,
    );
    if (!this.layoutConfig) {
      this.loaderLogger.warn('Layout config is undefined!');
      return;
    }
    const dependencies = this.getDependencies(widgetConfig, widgetName);
    const domEl = document.getElementById(widgetConfig.mountsIn || '');
    if (!domEl) {
      this.loaderLogger.warn(`cannot find node with id ${widgetConfig.mountsIn}`);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { loadingFn, title, mountsIn, ...otherLayoutProps } = this.layoutConfig as LayoutConfig;

    const widgetProps = {
      ...this.worldConfig,
      ...widgetConfig,
      layoutConfig: { ...otherLayoutProps },
      domElement: domEl,
      sdkModules: dependencies,
      rxjsOperators: rxjsOperators,
      globalChannel: this.sdk.globalChannel,
      uiEvents: this.uiEvents,
      isMobile: this.isMobile,
      logger: this.logger.child({ module: widgetName }),
      integrations: this.integrations,
      installIntegration: this.installIntegration.bind(this),
      uninstallIntegration: this.uninstallIntegration.bind(this),
      navigateToModal: this.navigateToModal.bind(this),
    };

    const widgetParcel = singleSpa.mountRootParcel(widgetConfig.loadingFn, widgetProps);
    this.widgetParcels.set(widgetName, widgetParcel);
    return widgetParcel.mountPromise;
  }

  private getDependencies(app: IAppConfig | IWidgetConfig, name: string) {
    const dependencies = {};
    if (app.sdkModules && app.sdkModules.length && this.sdk) {
      for (const dep of app.sdkModules) {
        if (this.sdk.hasOwnProperty(dep.module)) {
          Object.assign(dependencies, { [dep.module]: this.sdk[dep.module] });
          this.loaderLogger.info(`${name} has access to ${dep.module} -> channel`);
        }
      }
    }
    return dependencies;
  }
  private onFirstMount() {
    console.timeEnd('AppLoader:firstMount');
    hideSplash();
    const matchedPlugins = this.getPluginsForLocation(window.location);
    if (window.location.pathname === '/' && matchedPlugins.length === 0) {
      if (this.worldConfig.homepageApp) {
        const homepageAppName = getNameFromDef(this.worldConfig.homepageApp);
        if (!homepageAppName) {
          this.loaderLogger.warn(`Misconfiguration of ${this.worldConfig.homepageApp}.`);
          return;
        }
        const homepageAppModule = this.integrations.modules[homepageAppName] as IAppConfig;
        if (homepageAppModule.routes) {
          return singleSpa.navigateToUrl(homepageAppModule.routes.rootRoute);
        } else {
          this.loaderLogger.warn(`There are no routes defined in the ${homepageAppName}.`);
          return;
        }
      } else {
        this.loaderLogger.error('There is no homepageApp set. Nothing to render!');
      }
    }
  }
  /**
   * Handle widget loading when routing inside an app (sub routes).
   * We need to re-iterate over the currently loaded widgets
   * and see if there are any that does not match the route anymore
   * otherwise the router will not work reliably.
   */
  private onRouting() {
    const { pathname } = window.location;
    const mountedApps = this.getPluginsForLocation(window.location);
    // let matchedApps: IPluginEntry[] = [];
    if (mountedApps.length === 0 && pathname === '/') {
      if (this.worldConfig.homepageApp) {
        const homeAppName = getNameFromDef(this.worldConfig.homepageApp);
        if (!homeAppName) {
          this.loaderLogger.warn('The app that was set as homepageApp is misconfigured!');
          return;
        }
        const homeAppConfig = this.integrations.modules[homeAppName] as IAppConfig;
        singleSpa.navigateToUrl(homeAppConfig.routes.rootRoute);
      } else {
        this.loaderLogger.error('There is no rootLoadedApp set. Nothing to render!');
      }
      return;
    }
  }

  public navigateToModal(opts: ModalNavigationOptions) {
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
  }

  private beforeRouting() {
    /**
     * we need to check if there are any integrations that WILL be loaded
     * at the given location.
     * Note that the integration may not be loaded/mounted yet so we cannot relay on
     * ev.detail.appsByNewStatus param.
     */
    const { search } = location;
    if (search.length) {
      const searchObj = qs.parse(search, { ignoreQueryPrefix: true }) as {
        modal: ModalNavigationOptions;
      };
      if (
        searchObj.modal &&
        (!this.activeModal || this.activeModal.name !== searchObj.modal.name)
      ) {
        this.uiEvents.next({
          event: EventTypes.ModalMountRequest,
          data: searchObj.modal,
        });
        console.log('Request modal mount:', searchObj.modal);
      }
    }
    const integrationsToMount = this.getPluginsForLocation(window.location);
    if (!integrationsToMount.length) {
      return;
    }
  }

  private onAppChange(ev: CustomEvent<SingleSpaEventDetail>) {
    this.loaderLogger.info(`single-spa:app-change %j`, ev.detail);
  }
  private getPluginsForLocation(location: Location) {
    return singleSpa.checkActivityFunctions(location);
  }
  public getMenuItems() {
    // return this.menuItems.items.slice(0);
  }
}
