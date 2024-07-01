import {
  AppEvents,
  ContentBlockEvents,
  ExtensionEvents,
  IAppConfig,
  IntegrationRegistrationOptions,
  IPluginConf,
  IRootComponentProps,
  RouteRegistrationEvents,
  UIEventData,
  WidgetEvents,
  WorldConfig,
  ExtensionManifest,
} from '@akashaorg/typings/lib/ui';
import { Subject, Subscription } from 'rxjs';
import { hidePageSplash, showPageSplash } from './splash-screen';
import * as singleSpa from 'single-spa';
import {
  getExtensionsData,
  getUserInstalledExtensions,
  getWorldDefaultExtensions,
} from './extensions';
import getSDK from '@akashaorg/awf-sdk';
import { ILogger } from '@akashaorg/typings/lib/sdk/log';
import Logging from '@akashaorg/awf-sdk/src/logging/index';
import {
  checkActivityFn,
  getDomElement,
  navigateToModal,
  getModalFromParams,
  parseQueryString,
} from './utils';
import EventBus from '@akashaorg/awf-sdk/src/common/event-bus';
import { APP_EVENTS, AUTH_EVENTS } from '@akashaorg/typings/lib/sdk';
import { IntegrationSchema } from '@akashaorg/awf-sdk/src/db/integrations.schema';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';

const isWindow = window && typeof window !== 'undefined';

type SystemModuleType = {
  register?: (opts: IntegrationRegistrationOptions) => IAppConfig;
  initialize?: (opts: Partial<IntegrationRegistrationOptions>) => Promise<void> | void;
  getPlugin?: (
    opts: Omit<IntegrationRegistrationOptions, 'layoutConfig'> & {
      encodeAppName: (name: string) => string;
      decodeAppName: (name: string) => string;
    },
  ) => Promise<IPluginConf>;
};

export default class AppLoader {
  worldConfig: WorldConfig;
  uiEvents: Subject<UIEventData>;
  extensionConfigs: Map<string, IAppConfig & { name: string }>;
  extensionModules: Map<string, SystemModuleType>;
  manifests: ExtensionManifest[];
  layoutConfig: IAppConfig;
  logger: ILogger;
  parentLogger: Logging;
  plugins: IPluginConf;
  globalChannel: EventBus;
  user: { id: string };
  globalChannelSub: Subscription;
  userExtensions: IntegrationSchema[];
  constructor(worldConfig: WorldConfig) {
    this.worldConfig = worldConfig;
    this.uiEvents = new Subject<UIEventData>();
    this.extensionConfigs = new Map();
    this.extensionModules = new Map();
    this.manifests = [];
    this.layoutConfig = null;
    this.parentLogger = getSDK().services.log;
    this.logger = this.parentLogger.create('app-loader');
    this.plugins = {};
    this.globalChannel = getSDK().api.globalChannel;
    this.user = null;
    this.globalChannelSub = null;
    this.userExtensions = [];
  }

  start = async () => {
    if (isWindow) {
      showPageSplash();
      window.addEventListener('single-spa:before-first-mount', this.onBeforeFirstMount);
      window.addEventListener('single-spa:first-mount', this.onFirstMount);
      window.addEventListener('single-spa:routing-event', this.onRouting);
      singleSpa.addErrorHandler(err => {
        this.logger.error(`single-spa error: ${err}`);
      });
    }

    singleSpa.start({
      urlRerouteOnly: true,
    });

    singleSpa.setUnmountMaxTime(5000, false);

    this.manifests = await getWorldDefaultExtensions(this.worldConfig);
    const layoutManifest = this.manifests.find(
      manifest => manifest.name === this.worldConfig.layout,
    );

    if (!layoutManifest) {
      this.logger.error('layout not found. Cannot continue.');
      return;
    }
    this.extensionModules = await this.importModules(this.manifests);
    this.plugins = await this.loadPlugins(this.extensionModules);
    await this.loadLayoutConfig();
    await this.initializeExtensions(this.extensionModules);
    this.extensionConfigs = this.registerExtensions(this.extensionModules);
    this.renderLayout();

    this.listenGlobalChannel().catch();
    // automatic logging in if previous session is detected
    const sdk = getSDK();
    await sdk.api.auth.getCurrentUser();
  };
  onBeforeFirstMount = () => hidePageSplash();
  onFirstMount = () => {
    this.singleSpaRegister(this.extensionConfigs);
  };
  onRouting = (ev: CustomEvent) => {
    const actuallyMountedApps = ev.detail.appsByNewStatus.MOUNTED.filter(
      (name: string) => name !== this.worldConfig.layout,
    );
    if ((!actuallyMountedApps || !actuallyMountedApps.length) && location.pathname === '/') {
      const homepageAppName = this.worldConfig.homepageApp;
      if (!homepageAppName) {
        this.logger.error(`There is no homepageApp defined in the world config! Cannot redirect!`);
        return;
      }
      if (isWindow) {
        window.history.replaceState(null, null, `/${this.worldConfig.homepageApp}/`);
      }
    }
  };
  importModules = async (manifests: ExtensionManifest[]) => {
    if (!this.manifests.length) return;
    const modules = new Map();
    for (const manifest of manifests) {
      if (this.extensionModules.has(manifest.name) || modules.has(manifest.name)) {
        continue;
      }
      if (!manifest.enabled) {
        continue;
      }
      if (manifest.sources.length === 0) {
        this.logger.warn(`No source path was found for integration ${manifest.name}. Skipping!`);
        continue;
      }

      if (manifest.sources.length > 1) {
        this.logger.info(
          `Multiple sources found for integration ${manifest.name}. Using ${manifest.sources[0]}`,
        );
      }
      const source = getSDK().services.common.ipfs.buildOriginLink(manifest.sources[0]);
      const mainFile = manifest?.manifestData?.mainFile || 'index.js';
      // does not play well with local overwrites
      //const sourceURL = new URL(mainFile, source);
      const module = await System.import<SystemModuleType>(`${source}/${mainFile}`);
      modules.set(manifest.name, module);
    }
    return modules;
  };
  listenGlobalChannel = async () => {
    // listen for user login event and fetch the extensions
    const sdk = getSDK();
    if (this.globalChannelSub) this.globalChannelSub.unsubscribe();

    this.globalChannelSub = sdk.api.globalChannel.subscribe({
      next: resp => {
        switch (resp.event) {
          case AUTH_EVENTS.SIGN_IN:
            this.handleLogin(resp.data);
            break;
          case AUTH_EVENTS.SIGN_OUT:
            this.handleLogout();
            break;
          case APP_EVENTS.INFO_READY:
            this.handleExtensionInstall(resp.data);
            break;
          case APP_EVENTS.REMOVED:
            this.handleExtensionUninstall(resp.data);
            break;
          default:
            break;
        }
      },
    });
  };
  handleLogin = (loginData: { id?: string }) => {
    // user logged in
    if (loginData && loginData.id) {
      this.user = { id: loginData.id };
      //@Todo: fix this
      //this.loadUserExtensions().catch(err => this.logger.error(err));
    }
  };
  handleLogout = () => {
    // unload user extensions
  };

  handleExtensionInstall = (extensionData: unknown) => {
    // listen for extension installs
  };
  handleExtensionUninstall = (extensionData: unknown) => {
    // listen for extension uninstalls
  };
  loadUserExtensions = async () => {
    // @TODO: implement when ready
    this.userExtensions = await getUserInstalledExtensions();
    const manifests = await getExtensionsData(
      this.userExtensions.map(e => e.name),
      this.worldConfig,
    );
    const modules = await this.importModules(manifests);
    const plugins = await this.loadPlugins(modules);
    await this.initializeExtensions(modules);
    const extensionConfigs = this.registerExtensions(modules);
    this.singleSpaRegister(extensionConfigs);
  };
  loadPlugins = async (extensionModules: Map<string, SystemModuleType>) => {
    const plugins = {};
    for (const [name, module] of extensionModules) {
      if (this.extensionConfigs.has(name)) {
        continue;
      }
      if (module.getPlugin && typeof module.getPlugin === 'function') {
        // load plugin;
        plugins[name] = await module.getPlugin({
          worldConfig: this.worldConfig,
          logger: this.parentLogger.create(`${name}_plugin`),
          uiEvents: this.uiEvents,
          encodeAppName: name => name,
          decodeAppName: (name: string) => decodeURIComponent(name),
        });
      }
    }
    return plugins;
  };
  initializeExtensions = async (extensionModules: Map<string, SystemModuleType>) => {
    for (const [name, module] of extensionModules) {
      if (module.initialize && typeof module.initialize === 'function') {
        await module.initialize({
          uiEvents: this.uiEvents,
          plugins: this.plugins,
          worldConfig: this.worldConfig,
          layoutConfig: this.layoutConfig.extensionsMap,
          logger: this.parentLogger.create(`${name}_initialize`),
        });
      }
    }
  };
  loadLayoutConfig = async () => {
    const layoutModule = this.extensionModules.get(this.worldConfig.layout);
    if (!layoutModule) {
      this.logger.error('Layout module not loaded!');
      return;
    }
    if (layoutModule.register && typeof layoutModule.register === 'function') {
      const logger = this.parentLogger.create(this.worldConfig.layout);
      this.layoutConfig = layoutModule.register({
        worldConfig: this.worldConfig,
        uiEvents: this.uiEvents,
        logger,
        layoutConfig: {},
      });
    }
  };
  registerExtensions = (extensionModules: Map<string, SystemModuleType>) => {
    const extensionConfigs = new Map();
    for (const [name, mod] of extensionModules) {
      if (name === this.worldConfig.layout) continue;
      if (this.extensionConfigs.has(name) || extensionConfigs.has(name)) continue;
      if (mod.register && typeof mod.register === 'function') {
        const config = mod.register({
          layoutConfig: this.layoutConfig.extensionsMap,
          worldConfig: this.worldConfig,
          logger: this.parentLogger.create(name),
          uiEvents: this.uiEvents,
        });
        extensionConfigs.set(name, { ...config, name });
        // fire register events
        this.uiEvents.next({
          event: RouteRegistrationEvents.RegisterRoutes,
          data: {
            name,
            menuItems: config?.menuItems,
            navRoutes: config?.routes,
          },
        });
        if (config?.contentBlocks) {
          this.uiEvents.next({
            event: ContentBlockEvents.RegisterContentBlock,
            data: config.contentBlocks.map(eb => ({ ...eb, appName: name })),
          });
        }
        if (config?.extensions) {
          this.uiEvents.next({
            event: ExtensionEvents.RegisterExtension,
            data: config.extensions.map(ext => ({ ...ext, appName: name })),
          });
        }
        const manifest = this.manifests.find(man => man.name === name);
        if (manifest && manifest.integrationType === AkashaAppApplicationType.Widget) {
          this.uiEvents.next({
            event: WidgetEvents.RegisterWidget,
            data: { ...config, appName: name },
          });
        }
        if (manifest && manifest.integrationType === AkashaAppApplicationType.App) {
          this.uiEvents.next({
            event: AppEvents.RegisterApplication,
            data: { config, manifest },
          });
        }
      }
    }
    return extensionConfigs;
  };
  renderLayout = () => {
    const layoutConf = this.layoutConfig;
    const logger = this.parentLogger.create(this.worldConfig.layout);
    singleSpa.registerApplication({
      name: this.worldConfig.layout,
      app: layoutConf.loadingFn,
      activeWhen: () => true,
      customProps: {
        domElement: getDomElement(layoutConf, this.worldConfig.layout, logger),
        singleSpa,
        baseRouteName: `/${this.worldConfig.layout}`,
        encodeAppName: (name: string) => name,
        decodeAppName: (name: string) => decodeURIComponent(name),
        navigateToModal: navigateToModal,
        getModalFromParams: getModalFromParams,
        parseQueryString: parseQueryString,
        worldConfig: this.worldConfig,
        layoutConfig: layoutConf.extensionsMap,
        uiEvents: this.uiEvents,
        logger,
        plugins: this.plugins,
      },
    });
  };
  singleSpaRegister = (extensionConfigs: Map<string, IAppConfig & { name: string }>) => {
    for (const [name, conf] of extensionConfigs) {
      if (singleSpa.getAppNames().includes(name)) continue;
      if (!conf.loadingFn || typeof conf.loadingFn !== 'function') continue;

      const manifest = this.manifests.find(m => m.name === name);
      if (manifest.integrationType !== AkashaAppApplicationType.App) continue;

      const customProps: IRootComponentProps & { domElementGetter: () => HTMLElement } = {
        domElementGetter: () => getDomElement(conf, name, this.logger),
        singleSpa,
        baseRouteName: `/${name}`,
        encodeAppName: name => name,
        decodeAppName: name => decodeURIComponent(name),
        navigateToModal: navigateToModal,
        getModalFromParams: getModalFromParams,
        parseQueryString: parseQueryString,
        worldConfig: this.worldConfig,
        layoutConfig: this.layoutConfig.extensionsMap,
        uiEvents: this.uiEvents,
        logger: this.parentLogger.create(name),
        plugins: this.plugins,
      };
      singleSpa.registerApplication({
        name,
        app: conf.loadingFn,
        activeWhen: (location: Location) =>
          checkActivityFn({
            config: conf,
            encodedAppName: decodeURIComponent(name),
            manifest,
            location,
          }),
        customProps: {
          ...customProps,
        },
      });
    }
  };
}
