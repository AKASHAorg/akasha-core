import {
  AppOrWidgetDefinition,
  EventTypes,
  ExtensionPointDefinition,
  IAppConfig,
  ILoaderConfig,
  ISdkConfig,
  IWidgetConfig,
  LayoutConfig,
  ModalNavigationOptions,
  UIEventData,
  IMenuList,
  IMenuItem,
  EventDataTypes,
  BaseIntegrationInfo,
  INTEGRATION_TYPES,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import getSDK from '@akashaproject/awf-sdk';
import * as rxjsOperators from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import * as singleSpa from 'single-spa';
import { createImportMap, getCurrentImportMaps, writeImports } from './import-maps';
import { getIntegrationInfo } from './registry';
import { hideSplash, showSplash } from './splash-screen';
import { NavigationFn, NavigationOptions, RootComponentProps } from '@akashaproject/ui-awf-typings';
import {
  createRootNode,
  findKey,
  getNameFromDef,
  navigateToModal,
  parseQueryString,
  toNormalDef,
} from './utils';
import qs from 'qs';
import Apps from './apps';
import Widgets from './widgets';
import { IAwfSDK } from '@akashaproject/sdk-typings';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';

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

/**
 * App loader is the central module for micro-frontends (apps)
 * Built as a layer over the single-spa library, it provides the required functionality
 * to install/uninstall, load/unload apps, widgets and plugins.
 * @example
 * ```
 * import { AppLoader } from '@akashaproject/ui-app-loader';
 * const appLoader = new AppLoader(options, sdkInstance);
 * appLoader.start();
 * ```
 */

/* eslint-disable complexity */
export default class AppLoader {
  public readonly uiEvents: BehaviorSubject<UIEventData>;

  /**
   * World configuration object. Used to set necessary endpoints, default loaded apps and widgets.
   */
  private readonly worldConfig: ILoaderConfig & ISdkConfig;
  private readonly loaderLogger: ILogger;
  private readonly sdk: IAwfSDK;
  private readonly menuItems: IMenuList;
  public layoutConfig?: LayoutConfig;
  private extensionPoints: Record<string, UIEventData['data'][]>;
  private readonly extensionParcels: Record<string, { id: string; parcel: singleSpa.Parcel }[]>;
  private activeModal?: ModalNavigationOptions;

  private apps: Apps;
  private widgets: Widgets;
  private registryOverrides: ILoaderConfig['registryOverrides'];

  constructor(worldConfig: ILoaderConfig & ISdkConfig, sdk: ReturnType<typeof getSDK>) {
    this.worldConfig = worldConfig;
    this.loaderLogger = sdk.services.log.create('app-loader');
    this.sdk = sdk;

    this.uiEvents = new BehaviorSubject({ event: EventTypes.Instantiated });

    // register event listeners
    this.addSingleSpaEventListeners();
    this.watchEvents();

    this.extensionPoints = {};
    this.extensionParcels = {};

    this.menuItems = { nextIndex: 1, items: [] };
    this.registryOverrides = worldConfig.registryOverrides || [];
  }

  private addSingleSpaEventListeners() {
    window.addEventListener('single-spa:first-mount', this.onFirstMount.bind(this));
    window.addEventListener('single-spa:before-routing-event', this.beforeRouting.bind(this));
    window.addEventListener('single-spa:app-change', this.onAppChange.bind(this));
    window.addEventListener('single-spa:routing-event', this.onRouting.bind(this));
  }

  private watchEvents() {
    this.uiEvents.subscribe(async eventData => {
      if (typeof eventData === 'object' && eventData.event) {
        switch (eventData.event) {
          case EventTypes.ExtensionPointMount:
            this.onExtensionPointMount(eventData.data);
            break;
          case EventTypes.ExtensionPointUnmount:
            this.onExtensionPointUnmount(eventData.data);
            break;
          case EventTypes.ModalMount:
            this.onModalMount(eventData.data);
            break;
          case EventTypes.ModalUnmount:
            this.onModalUnmount(eventData.data);
            break;
          case EventTypes.InstallIntegration:
            await this.installIntegration(eventData.data);
            break;
          case EventTypes.UninstallIntegration:
            await this.uninstallIntegration(eventData.data);
            break;
          default:
            break;
        }
      }
    });

    if (this.sdk.api.globalChannel) {
      const loginEvent = this.sdk.api.globalChannel.pipe(
        rxjsOperators.filter(ev => ev && ev.hasOwnProperty('event') && ev['event'] === 'signIn'),
      );
      loginEvent.subscribe({
        next: () => {
          this.getUserIntegrations();
        },
        error: (err: Error) => this.loaderLogger.error(`${err}`),
      });
    }
  }

  /**
   * The main method to start the app-loader.
   * @remarks
   * When the `.start()` method is called, the app-loader will do the following:
   * - mount the splash screen if a template with id `#splash-screen-tpl` is found in the DOM
   * - call single-spa's `.start()` method
   * - get default apps and widgets package infos from app registry
   * - creates a systemjs-importmap script in the head section of the document in the form of [key: id of the app]: [value: url of the src file]
   * - imports the apps/widgets
   * - calls the `.register()` method of the app/widget
   * - mounts the layout widget
   */

  public async start(): Promise<void> {
    showSplash();
    // call as fast as possible
    // https://github.com/single-spa/single-spa/issues/484
    singleSpa.start({
      urlRerouteOnly: true,
    });

    const defaultIntegrations = [
      this.worldConfig.layout,
      this.worldConfig.homepageApp,
      ...this.worldConfig.defaultApps,
      ...this.worldConfig.defaultWidgets,
    ];

    const integrationInfos = await this.getPackageInfos(defaultIntegrations);
    // adds a new importMaps script into the head of the document
    // with the default integrations
    await this.createImportMaps(integrationInfos, 'default-world-integrations');
    const layoutConfig = await this.importLayoutConfig(integrationInfos);
    if (!layoutConfig) {
      this.loaderLogger.warn('Cannot get layoutConfig!');
      return;
    }

    this.apps = new Apps({
      layoutConfig: layoutConfig,
      worldConfig: this.worldConfig,
      uiEvents: this.uiEvents,
      sdk: this.sdk,
      addMenuItem: this.addMenuItem.bind(this),
      getMenuItems: this.getMenuItems.bind(this),
      navigateTo: this.navigateTo.bind(this),
    });

    this.widgets = new Widgets({
      layoutConfig: layoutConfig,
      worldConfig: this.worldConfig,
      uiEvents: this.uiEvents,
      sdk: this.sdk,
      addMenuItem: this.addMenuItem.bind(this),
      getMenuItems: this.getMenuItems.bind(this),
      getAppRoutes: appId => this.apps.getAppRoutes(appId),
      navigateTo: this.navigateTo.bind(this),
    });

    integrationInfos.forEach(integration => {
      if (integration.integrationType === INTEGRATION_TYPES.APPLICATION) {
        this.apps.add(integration);
      }
      if (integration.integrationType === INTEGRATION_TYPES.WIDGET) {
        this.widgets.add(integration);
      }
    });
    // import the config objects (by calling Systemjs.import())
    await this.apps.import();
    await this.widgets.import();
    await this.apps.importConfigs();
    await this.widgets.importConfigs();
    await this.loadLayout();
  }

  public getUserIntegrations() {
    if (!this.sdk) {
      return;
    }
    const doc = this.sdk.services.appSettings.getAll();

    doc.subscribe({
      next: async ({ data }) => {
        this.loaderLogger.info(`currently installed apps ${JSON.stringify(data)}`);
        if (!data.length) {
          return;
        }
        const infos = await this.getPackageInfos(data);
        const appInfos = this.apps.infos;
        const widgetInfos = this.widgets.infos;
        const userAppsToLoad = infos.filter(
          info => ![...appInfos, ...widgetInfos].some(installed => installed.name === info.name),
        );

        if (!userAppsToLoad.length) {
          return;
        }

        await this.createImportMaps(userAppsToLoad, 'user-installed-integrations');

        if (!infos.length) {
          return;
        }

        for (const info of userAppsToLoad) {
          if (info.integrationType === INTEGRATION_TYPES.APPLICATION) {
            this.apps.add(info);
          }
          if (info.integrationType === INTEGRATION_TYPES.WIDGET) {
            this.widgets.add(info);
          }
        }
        if (userAppsToLoad.some(info => info.integrationType === INTEGRATION_TYPES.APPLICATION)) {
          await this.apps.import();
          await this.apps.importConfigs();
        }
        if (userAppsToLoad.some(info => info.integrationType === INTEGRATION_TYPES.WIDGET)) {
          await this.widgets.import();
          await this.apps.importConfigs();
        }
        for (const info of userAppsToLoad) {
          const appConfig = this.apps.configs[info.name];
          const widgetConfig = this.widgets.configs[info.name];
          const config = appConfig || widgetConfig;
          if (!config) {
            this.loaderLogger.warn(`Config not found for app: ${info.name}`);
            continue;
          }
          await this.mountExtension(config, info);
        }
      },
      error: (err: Error) => {
        this.loaderLogger.error(`Failed to get user installed apps. Error: ${err.message}`);
      },
    });
  }
  /**
   * Handles the modal mounting logic into the slot defined by the layout widget.
   * This is triggered when we receive a moudal-mount event via the eventBus and
   * it iterates through the apps/widgets and finds an extention point that matches the modal name
   */
  public onModalMount(modalData: UIEventData['data']) {
    this.loaderLogger.info(`Modal mounted: ${JSON.stringify(modalData)}`);

    this.activeModal = modalData;
    const appConfigs = this.apps.configs;
    const widgetConfigs = this.widgets.configs;
    const appInfos = this.apps.infos;
    const widgetInfos = this.widgets.infos;
    const appExtensions = this.apps.getExtensions();
    const widgetExtensions = this.widgets.getExtensions();
    const extToLoad = this.filterExtensionsByMountPoint(
      [...appExtensions, ...widgetExtensions],
      { ...appConfigs, ...widgetConfigs },
      [...appInfos, ...widgetInfos],
      this.activeModal,
    );
    for (const [index, ext] of extToLoad.entries()) {
      this.mountExtensionPoint(ext, index, this.activeModal)
        .then(() => true)
        .catch(err => this.loaderLogger.warn(err));
    }
  }
  // iterate over all extension parcels and return parcel
  private findParcel(name: string) {
    for (const extName in this.extensionParcels) {
      if (this.extensionParcels.hasOwnProperty(extName)) {
        const parcels = this.extensionParcels[extName];
        for (const parcel of parcels) {
          if (parcel.id === name) {
            return parcel;
          }
        }
      }
    }
  }
  /**
   * Find the parcel that was mounted into the modal slot
   * and call unmount() on it
   */
  public onModalUnmount(modalData: UIEventData['data']) {
    if (this.activeModal && this.activeModal.name === modalData.name) {
      const parcelData = this.findParcel(modalData.name);
      if (parcelData) {
        this.loaderLogger.info(`Unmounting parcel: ${parcelData.id}`);
        parcelData.parcel
          .unmount()
          .then(() => {
            for (const ext in this.extensionParcels) {
              if (this.extensionParcels.hasOwnProperty(ext)) {
                const parcels = this.extensionParcels[ext];
                for (const parcel of parcels) {
                  if (parcel.id === parcelData.id) {
                    this.extensionParcels[ext].splice(parcels.indexOf(parcel), 1);
                  }
                }
              }
            }
          })
          .catch(err => this.loaderLogger.warn(err.message));
      }
      this.activeModal = undefined;
    } else if (this.activeModal && this.activeModal.name !== modalData.name) {
      this.loaderLogger.error(
        `Cannot unmount modal. Name mismatch: ${modalData.name} != ${this.activeModal.name}`,
      );
    } else {
      this.loaderLogger.info('Modal already unmounted. Nothing to do!');
    }
  }

  public filterExtensionsByMountPoint(
    appAndWidgetExtensions: ExtensionPointDefinition[],
    integrationConfigs: Record<string, IAppConfig | IWidgetConfig>,
    integrationInfos: BaseIntegrationInfo[],
    extensionData: UIEventData['data'],
  ) {
    return appAndWidgetExtensions.filter(ext => {
      let mountPoint;
      let isActive = true;
      if (ext.mountsIn && typeof ext.mountsIn === 'function') {
        mountPoint = ext.mountsIn({
          layoutConfig: this.layoutConfig,
          worldConfig: this.worldConfig,
          uiEvents: this.uiEvents,
          integrations: {
            configs: integrationConfigs,
            infos: integrationInfos,
          },
          extensionData,
        });
      }
      if (ext.mountsIn && typeof ext.mountsIn === 'string') {
        mountPoint = ext.mountsIn;
      }
      if (ext.hasOwnProperty('activeWhen') && typeof ext.activeWhen === 'function') {
        isActive = ext.activeWhen(location, singleSpa.pathToActiveWhen, this.layoutConfig);
      }
      if (!mountPoint) {
        return false;
      }
      return mountPoint === extensionData?.name && isActive;
    });
  }
  /**
   * Various apps can define one or more extension point slots.
   * Whenever an extension point slot is mounted (aka rendered into the dom),
   * it triggers a 'extension-point-mount' event.
   * Here we iterate over the apps and widgets to find an extension point that matches the slot name.
   * The actual mount/render of the extesion point is done in mountExtensionPoint method.
   */
  public onExtensionPointMount(extensionData?: UIEventData['data']) {
    const layoutName = getNameFromDef(this.worldConfig.layout);
    if (!layoutName) {
      this.loaderLogger.warn(`Layout name is misconfigured!`);
      return;
    }

    if (extensionData) {
      if (this.extensionPoints[extensionData.name]) {
        this.extensionPoints[extensionData.name].push(extensionData);
      } else {
        this.extensionPoints[extensionData.name] = [extensionData];
      }
      // handle the apps and widgets that must be mounted in this extension point
      this.apps.onExtensionPointMount(extensionData);
      this.widgets.onExtensionPointMount(extensionData);

      // handle extension points
      const appConfigs = this.apps.configs;
      const widgetConfigs = this.widgets.configs;
      const appInfos = this.apps.infos;
      const widgetInfos = this.widgets.infos;
      const appExtensions = this.apps.getExtensions();
      const widgetExtensions = this.widgets.getExtensions();
      // load extensions that must be mounted in this extention point
      const extToLoad = this.filterExtensionsByMountPoint(
        [...appExtensions, ...widgetExtensions],
        { ...appConfigs, ...widgetConfigs },
        [...appInfos, ...widgetInfos],
        extensionData,
      );
      extToLoad.forEach((extension, index) => {
        this.mountExtensionPoint(extension, index, extensionData).catch(err =>
          this.loaderLogger.warn(err),
        );
      });
    }
  }
  public navigateTo(options: string | NavigationOptions | NavigationFn) {
    if (typeof options === 'string') {
      singleSpa.navigateToUrl(options);
    }
    let redirectQueryString = findKey('redirectTo', parseQueryString(location.search));

    if (typeof options === 'function') {
      singleSpa.navigateToUrl(options(qs.stringify, redirectQueryString));
    }
    if (typeof options === 'object') {
      const { appName, queryStrings } = options;
      let { pathName } = options;

      // @todo: check whether we have a use case for appName being a function
      // if (typeof appName === 'function') {
      //   try {
      //     appName = appName(appConfigs);
      //   } catch (err) {
      //     this.loaderLogger.error(
      //       'Application not found! In the future we should redirect to an application not found page.',
      //     );
      //     return;
      //   }
      // }

      const appConfigs = Object.values(this.apps.configs);
      const app = appConfigs.find(appConf => appConf.name === appName);

      if (typeof pathName === 'function') {
        try {
          pathName = pathName(app.routes);
        } catch (err) {
          this.loaderLogger.error(
            `Path not found! Tried to find a path for application: ${appName}. Defaulting to rootRoute!`,
          );
        }
      }

      if (!pathName) {
        pathName = app.routes.rootRoute;
      }

      if (typeof queryStrings === 'function') {
        // allow to modify the redirect params
        redirectQueryString = queryStrings(qs.stringify, redirectQueryString);
      }
      const currentPath = location.pathname;
      const currentSearch = location.search;

      if (pathName === currentPath && redirectQueryString === currentSearch) {
        return;
      }
      singleSpa.navigateToUrl(`${pathName}${redirectQueryString ? `?${redirectQueryString}` : ''}`);
    }
  }

  public onExtensionPointUnmount(extensionData?: { name: string }) {
    if (!extensionData || !extensionData.name) {
      return;
    }
    // handle widget unmount
    this.widgets.onExtensionPointUnmount(extensionData);

    const extPoint = this.extensionPoints[extensionData.name].find(
      extPoint => extPoint && extPoint.name === extensionData.name,
    );
    if (extPoint) {
      this.loaderLogger.info(`extension point is unmounting: ${extPoint}`);
      const parcelData = this.findParcel(extPoint.name);
      if (parcelData) {
        parcelData.parcel.unmount();
      }
    }
  }

  // get registry info for package
  public async getPackageInfo(pack: AppOrWidgetDefinition): Promise<BaseIntegrationInfo | null> {
    const normalized = toNormalDef(pack);
    if (!normalized) {
      this.loaderLogger.warn(`There is a misconfiguration in app ${pack} definitions!`);
      return Promise.resolve(null);
    }
    return getIntegrationInfo(normalized);
  }

  // get registry info for multiple packages
  public async getPackageInfos(packages: AppOrWidgetDefinition[]) {
    const integrationInfos: BaseIntegrationInfo[] = [];

    for (const pack of packages) {
      let name = pack;
      if (typeof pack === 'object') {
        name = pack.name;
      }
      const overrideInfo = this.registryOverrides.find(integration => integration.name === name);
      if (overrideInfo) {
        integrationInfos.push(overrideInfo);
        continue;
      }
      const info = await this.getPackageInfo(name);
      if (info) {
        integrationInfos.push(info);
        continue;
      }
      continue;
    }
    return integrationInfos;
  }

  /**
   * Get the infos about the apps and register them into systemjs
   */
  public async createImportMaps(infos: BaseIntegrationInfo[], scriptId: string) {
    const currentImportMap = getCurrentImportMaps();

    if (!currentImportMap) {
      this.loaderLogger.warn('Import-maps script element was not found! Stopping!');
      return;
    }
    const newMap = createImportMap(infos);

    writeImports(newMap, scriptId);

    await (
      System as typeof System & {
        prepareImport: (doProcessScripts?: boolean) => Promise<void>;
      }
    ).prepareImport(true);
  }

  public async importLayoutConfig(integrationInfos: BaseIntegrationInfo[]) {
    const layoutApp = getNameFromDef(this.worldConfig.layout);
    if (!layoutApp) {
      this.loaderLogger.error('Layout widget/app was not found!');
      return null;
    }
    try {
      const layoutInfo = integrationInfos.find(int => int.name === layoutApp);
      if (!layoutInfo) {
        this.loaderLogger.error(`Cannot fetch layout info`);
        return null;
      }

      const mod = await System.import(layoutInfo.name);

      this.layoutConfig = mod.register({
        worldConfig: {
          title: this.worldConfig.title,
        },
      });
      return this.layoutConfig;
    } catch (err) {
      this.loaderLogger.error(`Error importing layout! ${err}`);
      return null;
    }
  }
  /**
   * Renders the layout widget that is defined in the world config.
   */
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
      layoutConfig: { ...layoutParams },
      logger: this.sdk.services.log.create(this.layoutConfig.name),
      mountParcel: singleSpa.mountRootParcel,
      name: this.layoutConfig.name,
      navigateToModal: navigateToModal,
      activeModal: this.activeModal,
      navigateTo: this.navigateTo.bind(this),
      parseQueryString: parseQueryString,
    });
    return layoutParcel.mountPromise;
  }
  /**
   * Install an integration
   * WIP
   */
  public async installIntegration(integration?: { name: string; version?: string }) {
    if (!integration) {
      return;
    }
    const { name, version = 'latest' } = integration;
    const definition = toNormalDef({ name, version });
    if (!definition) {
      this.loaderLogger.warn(
        `Misconfiguration of ${name}. It should be a string or object of type: {name: string; version: string}.`,
      );
      return;
    }
    const info = await this.getPackageInfo(definition);

    if (!info) {
      this.loaderLogger.info(`Cannot find package ${definition}`);
      return;
    }

    await this.createImportMaps([info], info.name);
    const call = this.sdk.services.appSettings.install({ name: info.name });
    call.subscribe({
      next: async () => {
        let config;
        if (info.integrationType === INTEGRATION_TYPES.APPLICATION) {
          await this.apps.install(info);
          config = this.apps.configs[info.name];
          if (!config) {
            this.loaderLogger.warn(`Config not found or is not ready yet! App: ${info.name}`);
          }
        }
        if (info.integrationType === INTEGRATION_TYPES.WIDGET) {
          await this.widgets.install(info);
          config = this.widgets.configs[info.name];
          if (!config) {
            this.loaderLogger.warn(`Config not found or is not ready yet! App: ${info.name}`);
          }
        }
        await this.mountExtension(config, info);
      },
      error: (err: Error) => {
        this.loaderLogger.error(`Cannot install app: ${info.name}. Error: ${err.message}`);
      },
    });
  }
  public async mountExtension(config: IAppConfig | IWidgetConfig, info: BaseIntegrationInfo) {
    if (config.extends && config.extends.length) {
      for (const [index, extension] of config.extends.entries()) {
        if (!extension.parentApp) {
          extension.parentApp = info.name;
        }
        for (const extData of Object.entries(this.extensionPoints)
          .map(([, extensions]) => extensions)
          .flat()) {
          await this.mountExtensionPoint(extension, index, extData);
        }
      }
    }
  }
  public async uninstallIntegration(integration?: { name: string; version?: string }) {
    if (!integration) {
      return;
    }

    const { name, version = 'latest' } = integration;
    const definition = toNormalDef({ name, version });
    if (!definition) {
      this.loaderLogger.warn(
        `Misconfiguration of ${integration}. It should be a string or object of type: {name: string, version: string}.`,
      );
      return;
    }
    const info = await this.getPackageInfo(definition);
    if (!info) {
      this.loaderLogger.info(`Cannot find package ${definition}`);
      return;
    }
    await this.sdk.services.appSettings.uninstall(info.name);
    if (info.integrationType === INTEGRATION_TYPES.APPLICATION) {
      await this.apps.uninstall(info);
    }
    if (info.integrationType === INTEGRATION_TYPES.WIDGET) {
      this.widgets.uninstall(info);
    }
  }

  public getMenuItems() {
    return { ...this.menuItems };
  }

  public addMenuItem(menuItem: IMenuItem) {
    this.menuItems.items.push({ ...menuItem, index: this.menuItems.nextIndex });
    this.menuItems.nextIndex += 1;
  }

  /**
   * call single-spa's mountRootParcel.
   * this is the actual mounting logic of the extension point
   */

  private async mountExtensionPoint(
    extensionPoint: ExtensionPointDefinition,
    index: number,
    extensionData: EventDataTypes,
  ) {
    let rootNode: string | null = null;

    if (typeof extensionPoint.mountsIn === 'string') {
      rootNode = extensionPoint.mountsIn;
    }
    if (typeof extensionPoint.mountsIn === 'function') {
      rootNode = extensionPoint.mountsIn({
        layoutConfig: this.layoutConfig,
        integrations: {
          configs: { ...this.apps.configs, ...this.widgets.configs },
          infos: [...this.apps.infos, ...this.widgets.infos],
        },
        worldConfig: this.worldConfig,
        uiEvents: this.uiEvents,
        extensionData: extensionData,
      });
    }
    if (!rootNode || !extensionPoint.mountsIn) {
      return this.loaderLogger.info(
        `skipping extension point of ${extensionPoint.parentApp} because there is no root node!`,
      );
    }

    const node = document.getElementById(rootNode);
    if (!node) {
      return;
    }
    const wrapperNode = createRootNode(node, extensionPoint.parentApp, 'extension');
    if (!wrapperNode) {
      return;
    }

    const extensionId = `ext-${extensionPoint.parentApp}-${rootNode}-${index}`;

    const extensionProps = {
      domElement: wrapperNode,
      singleSpa,
      uiEvents: this.uiEvents,
      extension: extensionPoint,
      navigateToModal: navigateToModal,
      layoutConfig: this.layoutConfig,
      activeModal: this.activeModal,
      logger: this.sdk.services.log.create(extensionId),
      extensionData,
      navigateTo: this.navigateTo.bind(this),
      parseQueryString: parseQueryString,
    };

    const extensionParcel = singleSpa.mountRootParcel(extensionPoint.loadingFn, extensionProps);

    const parcelData = {
      id: `${rootNode}`,
      parcel: extensionParcel,
    };

    if (!this.extensionParcels[extensionPoint.parentApp as string]) {
      this.extensionParcels[extensionPoint.parentApp as string] = [parcelData];
    } else {
      this.extensionParcels[extensionPoint.parentApp as string].push(parcelData);
    }
    await extensionParcel.mountPromise;
  }

  private onFirstMount() {
    // eslint-disable-next-line no-console
    console.timeEnd('AppLoader:firstMount');
    hideSplash();
    // because we called singlespa.start() early
    if (this.apps.getAppsCount().configs > 0) {
      this.apps.onFirstMount(window.location);
    }
  }
  /**
   * Handle widget loading when routing inside an app (sub routes).
   * We need to re-iterate over the currently loaded widgets
   * and see if there are any that does not match the route anymore
   * otherwise the router will not work reliably.
   */
  private onRouting() {
    if (this.apps) {
      this.apps.onRouting(window.location);
    }
    if (!this.apps || !this.widgets) {
      return;
    }
    const appConfigs = this.apps.configs;
    const widgetConfigs = this.widgets.configs;
    const appInfos = this.apps.infos;
    const widgetInfos = this.widgets.infos;
    const appExtensions = this.apps.getExtensions();
    const widgetExtensions = this.widgets.getExtensions();
    for (const extensionName in this.extensionPoints) {
      if (this.extensionPoints.hasOwnProperty(extensionName)) {
        const extensionDatas = this.extensionPoints[extensionName];
        extensionDatas.forEach(extensionData => {
          // load extensions that must be mounted in this extention point
          const extToLoad = this.filterExtensionsByMountPoint(
            [...appExtensions, ...widgetExtensions],
            { ...appConfigs, ...widgetConfigs },
            [...appInfos, ...widgetInfos],
            extensionData,
          );
          extToLoad.forEach((extension, index) => {
            this.mountExtensionPoint(extension, index, extensionData).catch(err =>
              this.loaderLogger.warn(err),
            );
          });
        });
      }
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
    const searchObj = qs.parse(search, { ignoreQueryPrefix: true }) as {
      modal: ModalNavigationOptions;
    };
    if (search.length) {
      if (
        searchObj.modal &&
        (!this.activeModal || this.activeModal.name !== searchObj.modal.name)
      ) {
        this.loaderLogger.info(`Requesting modal mount ${JSON.stringify(searchObj.modal)}`);
        this.uiEvents.next({
          event: EventTypes.ModalMountRequest,
          data: searchObj.modal,
        });
      }
    }

    if (this.activeModal && !searchObj.hasOwnProperty('modal')) {
      this.loaderLogger.info(`Unmounting modal ${this.activeModal.name}`);
      this.uiEvents.next({
        event: EventTypes.ModalUnmountRequest,
        data: this.activeModal,
      });
    }

    // const integrationsToMount = this.getPluginsForLocation(window.location);
    // if (!integrationsToMount.length) {
    //   return;
    // }
  }

  private onAppChange(ev: CustomEvent<SingleSpaEventDetail>) {
    this.loaderLogger.info(`single-spa:app-change ${JSON.stringify(ev.detail)}`);
  }
  private getPluginsForLocation(location: Location) {
    return singleSpa.checkActivityFunctions(location);
  }
}
