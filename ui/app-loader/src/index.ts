import {
  AppOrWidgetDefinition,
  AppRegistryInfo,
  EventTypes,
  ExtensionPointDefinition,
  IAppConfig,
  ILoaderConfig,
  IntegrationConfig,
  ISdkConfig,
  IWidgetConfig,
  LayoutConfig,
  ModalNavigationOptions,
  UIEventData,
  WidgetRegistryInfo,
  IMenuList,
  IMenuItem,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import getSDK from '@akashaproject/awf-sdk';
import * as rxjsOperators from 'rxjs/operators';
import pino from 'pino';
import { BehaviorSubject } from 'rxjs';
import * as singleSpa from 'single-spa';
import { createImportMap, getCurrentImportMaps, writeImports } from './import-maps';
import { getIntegrationInfo, getIntegrationInfos } from './registry';
import { hideSplash, showSplash } from './splash-screen';
import detectMobile from 'ismobilejs';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { createRootNode, getNameFromDef, navigateToModal, toNormalDef } from './utils';
import qs from 'qs';
import Apps from './apps';
import Widgets from './widgets';

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

export default class AppLoader {
  public readonly uiEvents: BehaviorSubject<UIEventData>;

  /**
   * World configuration object. Used to set necessary endpoints, default loaded apps and widgets.
   */
  private readonly worldConfig: ILoaderConfig & ISdkConfig;
  private readonly logger: pino.BaseLogger;
  private readonly loaderLogger: pino.Logger;
  private readonly sdk: ReturnType<typeof getSDK>;
  private readonly menuItems: IMenuList;
  public integrations: {
    info: (AppRegistryInfo | WidgetRegistryInfo)[];
    modules: Record<string, IntegrationConfig>;
  };
  public layoutConfig?: LayoutConfig;
  private readonly isMobile: boolean;
  private extensionPoints: UIEventData['data'][];
  private readonly extensionParcels: Record<string, { id: string; parcel: singleSpa.Parcel }[]>;
  private activeModal?: ModalNavigationOptions;

  private apps: Apps;
  private widgets: Widgets;
  // private extensions: Extensions;
  constructor(worldConfig: ILoaderConfig & ISdkConfig, sdk: ReturnType<typeof getSDK>) {
    this.worldConfig = worldConfig;
    // root logger
    this.logger = pino({ browser: { asObject: true }, level: worldConfig.logLevel });
    // logger specific to this module
    this.loaderLogger = this.logger.child({ module: 'app-loader' });

    this.sdk = sdk;
    this.isMobile = detectMobile().phone || detectMobile().tablet;

    this.uiEvents = new BehaviorSubject({ event: EventTypes.Instantiated });

    // register event listeners
    this.addSingleSpaEventListeners();
    this.watchEvents();

    this.extensionPoints = [];
    this.extensionParcels = {};

    this.menuItems = { nextIndex: 1, items: [] };
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
        rxjsOperators.filter(ev => ev?.event === 'signIn'),
      );
      loginEvent.subscribe({
        next: () => {
          this.getUserIntegrations();
        },
        error: (err: Error) => this.loaderLogger.error(`${err}`),
      });
    }
  }

  public async start(): Promise<void> {
    showSplash();
    // call as fast as possible
    // https://github.com/single-spa/single-spa/issues/484
    singleSpa.start({
      urlRerouteOnly: true,
    });

    const integrationInfos = await this.getPackageInfos([
      this.worldConfig.layout,
      this.worldConfig.homepageApp,
      ...this.worldConfig.defaultApps,
      ...this.worldConfig.defaultWidgets,
    ]);
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
      logger: this.logger,
      sdk: this.sdk,
      addMenuItem: this.addMenuItem.bind(this),
      getMenuItems: this.getMenuItems.bind(this),
      isMobile: this.isMobile,
    });

    this.widgets = new Widgets({
      layoutConfig: layoutConfig,
      worldConfig: this.worldConfig,
      uiEvents: this.uiEvents,
      logger: this.logger,
      sdk: this.sdk,
      addMenuItem: this.addMenuItem.bind(this),
      getMenuItems: this.getMenuItems.bind(this),
      isMobile: this.isMobile,
    });

    integrationInfos.forEach(integration => {
      if (integration.type === 'app') {
        this.apps.add(integration);
      }
      if (integration.type === 'widget') {
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
      next: async (resp: any) => {
        const { data } = resp;
        this.loaderLogger.info('currently installed apps %o', data.apps);
        if (!data.apps.length) {
          return;
        }
        const infos = await this.getPackageInfos(data.apps);
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
          if (info.type === 'app') {
            this.apps.add(info);
          }
          if (info.type === 'widget') {
            this.widgets.add(info);
          }
        }
        if (userAppsToLoad.some(info => info.type === 'app')) {
          await this.apps.import();
          await this.apps.importConfigs();
        }
        if (userAppsToLoad.some(info => info.type === 'widget')) {
          await this.widgets.import();
          await this.apps.importConfigs();
        }
        for (const info of userAppsToLoad) {
          const appConfig = this.apps.configs[info.name];
          const widgetConfig = this.widgets.configs[info.name];
          const config = appConfig || widgetConfig;
          if (!config) {
            this.loaderLogger.warn('Config not found for app: %s', info.name);
            continue;
          }
          await this.mountExtension(config, info);
        }
      },
      error: (err: Error) => {
        this.loaderLogger.error(`Failed to get user installed apps. Error: ${err}`);
      },
    });
  }

  public onModalMount(modalData: UIEventData['data']) {
    this.loaderLogger.info('Modal mounted: %o', modalData);

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
      modalData,
    );
    for (const [index, ext] of extToLoad.entries()) {
      this.mountExtensionPoint(ext, index)
        .then(() => true)
        .catch(err => this.loaderLogger.warn(err));
    }
  }
  public onModalUnmount(modalData: UIEventData['data']) {
    if (this.activeModal.name === modalData.name) {
      this.activeModal = undefined;
    } else {
      this.loaderLogger.error(
        'Cannot unmount modal. Name mismatch: %s != %s',
        modalData.name,
        this.activeModal.name,
      );
    }
  }

  public filterExtensionsByMountPoint(
    extensions: ExtensionPointDefinition[],
    integrationConfigs: Record<string, IAppConfig | IWidgetConfig>,
    integrationInfos: (AppRegistryInfo | WidgetRegistryInfo)[],
    extensionData: UIEventData['data'],
  ) {
    return extensions.filter(ext => {
      let mountPoint;
      if (ext.mountsIn && typeof ext.mountsIn === 'function') {
        mountPoint = ext.mountsIn({
          layoutConfig: this.layoutConfig,
          worldConfig: this.worldConfig,
          uiEvents: this.uiEvents,
          integrations: {
            configs: integrationConfigs,
            infos: integrationInfos,
          },
          isMobile: this.isMobile,
        });
      }
      if (ext.mountsIn && typeof ext.mountsIn === 'string') {
        mountPoint = ext.mountsIn;
      }
      if (!mountPoint) {
        return false;
      }
      return mountPoint === extensionData?.name;
    });
  }

  public onExtensionPointMount(extensionData?: UIEventData['data']) {
    const layoutName = getNameFromDef(this.worldConfig.layout);
    if (!layoutName) {
      this.loaderLogger.warn(`Layout name is misconfigured!`);
      return;
    }

    if (extensionData) {
      this.extensionPoints.push(extensionData);
      // handle the main app and widgets
      this.apps.onExtensionPointMount(extensionData);
      this.widgets.onExtensionPointMount(extensionData);

      // handle extension points
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
        extensionData,
      );
      extToLoad.forEach((extension, index) => {
        this.mountExtensionPoint(extension, index).catch(err => this.loaderLogger.warn(err));
      });
    }
  }

  public onExtensionPointUnmount(extensionData?: { name: string }) {
    if (!extensionData || extensionData.name) {
      return;
    }
    const extPoint = this.extensionPoints.find(
      extPoint => extPoint && extPoint.name === extensionData.name,
    );
    if (extPoint) {
      this.loaderLogger.info(`extension point is unmounting: ${extPoint}`);
    }
  }

  // get registry info for package
  public async getPackageInfo(
    pack: AppOrWidgetDefinition,
  ): Promise<AppRegistryInfo | WidgetRegistryInfo | null> {
    const normalized = toNormalDef(pack);
    if (!normalized) {
      this.loaderLogger.warn(`There is a misconfiguration in app ${pack} definitions!`);
      return Promise.resolve(null);
    }
    return await getIntegrationInfo(normalized);
  }

  // get registry info for multiple packages
  public async getPackageInfos(packages: AppOrWidgetDefinition[]) {
    const regInfos = packages
      .map(def => {
        const normalized = toNormalDef(def);
        if (!normalized) {
          this.loaderLogger.warn(`Error in configuration of ${def}`);
          return null;
        }
        return normalized;
      })
      .filter(m => m !== null) as NonNullable<{ name: string; version: string }[]>;
    return await getIntegrationInfos(regInfos);
  }

  /**
   * Get the infos about the apps and register them into systemjs
   */
  public async createImportMaps(infos: (AppRegistryInfo | WidgetRegistryInfo)[], scriptId: string) {
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
  }

  public async importLayoutConfig(integrationInfos: (AppRegistryInfo | WidgetRegistryInfo)[]) {
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
      layoutConfig: { ...layoutParams },
      logger: this.logger.child({ module: this.layoutConfig.name }),
      mountParcel: singleSpa.mountRootParcel,
      name: this.layoutConfig.name,
      navigateToModal: navigateToModal,
    });
    return layoutParcel.mountPromise;
  }

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
      next: async _resp => {
        if (info.type === 'app') {
          await this.apps.install(info);
          const config = this.apps.configs[info.name];
          if (!config) {
            this.loaderLogger.warn(`Config not found or is not ready yet! App: ${info.name}`);
          }
          await this.mountExtension(config, info);
        }
        if (info.type === 'widget') {
          await this.widgets.install(info);
          const config = this.widgets.configs[info.name];
          if (!config) {
            this.loaderLogger.warn(`Config not found or is not ready yet! App: ${info.name}`);
          }
          await this.mountExtension(config, info);
        }
      },
      error: (err: Error) => {
        this.logger.error(err);
      },
    });
  }
  public async mountExtension(
    config: IAppConfig | IWidgetConfig,
    info: AppRegistryInfo | WidgetRegistryInfo,
  ) {
    if (config.extends && config.extends.length) {
      for (const [index, extension] of config.extends.entries()) {
        let mountsIn = extension.mountsIn;
        if (typeof extension.mountsIn === 'function') {
          mountsIn = extension.mountsIn({
            layoutConfig: this.layoutConfig,
            worldConfig: this.worldConfig,
            uiEvents: this.uiEvents,
            integrations: {
              configs: { ...this.apps.configs, ...this.widgets.configs },
              infos: [...this.apps.infos, ...this.widgets.infos],
            },
            isMobile: this.isMobile,
          });
        }
        if (!extension.parentApp) {
          extension.parentApp = info.name;
        }
        if (this.extensionPoints.some(ep => ep?.name === mountsIn)) {
          await this.mountExtensionPoint(extension, index);
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
    if (info.type === 'app') {
      this.apps.uninstall(info);
    }
    if (info.type === 'widget') {
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

  private async mountExtensionPoint(extensionPoint: ExtensionPointDefinition, index: number) {
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
        isMobile: this.isMobile,
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
    const wrapperNode = createRootNode(node, extensionPoint.parentApp as string, 'extension');
    if (!wrapperNode) {
      return;
    }

    const extensionProps = {
      domElement: wrapperNode,
      singleSpa,
      extension: extensionPoint,
      navigateToModal: navigateToModal,
    };

    const extensionParcel = singleSpa.mountRootParcel(extensionPoint.loadingFn, extensionProps);

    const parcelData = {
      id: `${rootNode}-${index}`,
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
        this.loaderLogger.info(`Requesting modal mount ${searchObj.modal}`);
        this.uiEvents.next({
          event: EventTypes.ModalMountRequest,
          data: searchObj.modal,
        });
      }
    }

    if (this.activeModal && !search.length) {
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
    this.loaderLogger.info(`single-spa:app-change %j`, ev.detail);
  }
  private getPluginsForLocation(location: Location) {
    return singleSpa.checkActivityFunctions(location);
  }
}
