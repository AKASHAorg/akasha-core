import {
  AppRegistryInfo,
  EventTypes,
  ExtensionPointDefinition,
  IAppConfig,
  IntegrationRegistrationOptions,
  IWidgetConfig,
  UIEventData,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import BaseIntegration, { BaseIntegrationClassOptions } from './base-integration';
import * as singleSpa from 'single-spa';
import { getNameFromDef, getSDKDependencies, navigateToModal } from './utils';
import pino from 'pino';

export interface IntegrationModule {
  register: (opts: IntegrationRegistrationOptions) => Promise<IAppConfig | IWidgetConfig>;
  install?: (sdk: any) => Promise<void>;
}

class Apps extends BaseIntegration {
  private appInfos: AppRegistryInfo[];
  private appConfigs: Record<string, IAppConfig>;
  private appModules: Record<string, IntegrationModule>;
  private logger: pino.Logger;
  constructor(opts: BaseIntegrationClassOptions) {
    super(opts);
    // registry infos
    this.appInfos = [];

    // modules: {[name: string]: ReturnType<System.import('name')> }
    this.appModules = {};

    // the config object that is returned by module.register();
    this.appConfigs = {};
    this.logger = opts.logger.child({ module: 'apps-loader' });
  }
  add(appInfo: AppRegistryInfo) {
    // todo
    this.appInfos.push(appInfo);
  }
  async import() {
    // todo
    const importPromise = this.appInfos.map(async info => {
      try {
        const mod = await System.import<IntegrationModule>(info.name);
        this.appModules[info.name] = mod;
      } catch (err) {
        this.logger.error(`Cannot import module: ${info.name} => error: ${err}`);
        // do not throw errors since this error
        // is specific to this integrations
        return Promise.resolve();
      }
    });
    await Promise.all(importPromise);
  }
  async importConfigs() {
    for (const name in this.appModules) {
      const appModule = this.appModules[name];

      if (appModule.hasOwnProperty('register') && typeof appModule.register === 'function') {
        this.appConfigs[name] = (await appModule.register({
          layoutConfig: this.layoutConfig,
          // uiEvents: this.uiEvents,
          worldConfig: {
            title: this.worldConfig.title,
          },
          sdk: this.sdk,
          uiEvents: this.uiEvents,
        })) as IAppConfig;
      } else {
        this.logger.warn(`Integration ${name} does not have a register() method exported!`);
      }
    }
    return Promise.resolve();
  }
  onFirstMount(location: Location) {
    const matched = this.getAppsForLocation(location);

    if (window.location.pathname === '/' && matched.length === 0) {
      if (this.worldConfig.homepageApp) {
        const homepageAppName = getNameFromDef(this.worldConfig.homepageApp);
        if (!homepageAppName) {
          this.logger.warn(`Misconfiguration of ${this.worldConfig.homepageApp}.`);
          return;
        }
        const homepageAppModule = this.appConfigs[homepageAppName];
        if (homepageAppModule?.routes) {
          return singleSpa.navigateToUrl(homepageAppModule.routes.rootRoute);
        } else {
          this.logger.warn(`There are no routes defined in the ${homepageAppName}.`);
          return;
        }
      } else {
        this.logger.error('There is no homepageApp set. Nothing to render!');
      }
    }
  }
  onRouting(location: Location) {
    const mountedApps = this.getAppsForLocation(location);
    if (mountedApps.length === 0 && location.pathname === '/') {
      if (this.worldConfig.homepageApp) {
        const homeAppName = getNameFromDef(this.worldConfig.homepageApp);
        if (!homeAppName) {
          this.logger.warn('The app that was set as homepageApp is misconfigured!');
          return;
        }
        const homeAppConfig = this.appConfigs[homeAppName];
        singleSpa.navigateToUrl(homeAppConfig.routes.rootRoute);
      } else {
        this.logger.error('There is no homepageApp set. Nothing to render!');
      }
      return;
    }
  }
  public getExtensions() {
    return this.appInfos
      .filter(info => {
        const config = this.appConfigs[info.name];
        if (!config) {
          return false;
        }
        return !!config.extends && config.extends.length > 0;
      })
      .reduce((acc: ExtensionPointDefinition[], appInfo) => {
        const appConfig = this.appConfigs[appInfo.name];
        if (appConfig.extends && appConfig.extends.length) {
          const extensions = appConfig.extends.map(ext => {
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
  onExtensionPointMount(extensionData?: UIEventData['data']) {
    const appsToLoad = this.filterAppsByMountPoint(this.appInfos, this.appConfigs, extensionData);
    appsToLoad.forEach(app => {
      this.registerApp(app.name);
    });
  }
  getAppsCount() {
    return {
      infos: this.appInfos.length,
      configs: Object.keys(this.appConfigs).length,
      modules: Object.keys(this.appModules).length,
    };
  }
  public registerApp(appName: string) {
    const registeredApps = singleSpa.getAppNames();
    if (registeredApps.some(app => app === appName)) {
      this.logger.info(`App ${appName} already registered`);
      return;
    }

    const appConfig = this.appConfigs[appName];
    if (!appConfig) {
      this.logger.warn(`there is no module with the name: ${appName}`);
      return;
    }

    this.logger.info(`registering app ${appName}`);

    const deps = getSDKDependencies(appConfig, this.sdk);

    if (appConfig.mountsIn) {
      singleSpa.registerApplication({
        name: appName,
        app: appConfig.loadingFn,
        activeWhen: location => this.checkActivityFn(appConfig, location),
        customProps: {
          domElementGetter: () => this.getDomElement(appConfig, appName, 'app'),
          sdkModules: deps,
          uiEvents: this.uiEvents,
          logger: this.baseLogger.child({ module: appName }),
          installIntegration: (name: string, version?: string) => {
            this.uiEvents.next({ event: EventTypes.InstallIntegration, data: { name, version } });
          },
          uninstallIntegration: (name: string) =>
            this.uiEvents.next({ event: EventTypes.UninstallIntegration, data: { name } }),
          navigateToModal: navigateToModal,
          layoutConfig: this.layoutConfig,
          globalChannel: this.sdk.globalChannel,
        },
      });
    } else {
      this.logger.warn('Cannot mount %s since there is not mountsIn property defined!', appName);
    }
  }

  public async install(appInfo: AppRegistryInfo) {
    const module = await System.import<IntegrationModule>(appInfo.name);
    if (!module) {
      this.logger.warn(`cannot import module: ${appInfo.name}`);
      return;
    }
    this.appModules[appInfo.name] = module;
    if (module.hasOwnProperty('install') && typeof module.install === 'function') {
      await module.install(this.sdk);
    }
    if (module.hasOwnProperty('register') && typeof module.register === 'function') {
      const appConfig = (await module.register({
        layoutConfig: this.layoutConfig,
        // uiEvents: this.uiEvents,
        worldConfig: {
          title: this.worldConfig.title,
        },
        sdk: this.sdk,
        uiEvents: this.uiEvents,
      })) as IAppConfig;
      if (!appConfig) {
        return;
      }
      this.appConfigs[appInfo.name] = appConfig;
      this.registerApp(appInfo.name);
    } else {
      this.logger.warn(`App ${appInfo.name} has no exported .register() function!`);
    }
  }
  public async uninstall(info: AppRegistryInfo) {
    const idx = this.appInfos.findIndex(inf => inf.name === info.name);
    if (idx >= 0) {
      delete this.appModules[info.name];
      this.appInfos.splice(idx, 1);
      if (info.type === 'app') {
        const registered = singleSpa.getAppNames();
        if (registered.includes(info.name)) {
          await singleSpa.unloadApplication(info.name);
          await singleSpa.unregisterApplication(info.name);
        }
      }
      this.logger.info(`app ${name} unloaded!`);
    }
  }

  get configs() {
    return this.appConfigs;
  }
  get infos() {
    return this.appInfos;
  }
  get modules() {
    return this.appModules;
  }
}

export default Apps;
