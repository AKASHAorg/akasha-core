import { i18n as i18nType } from 'i18next';
import pino from 'pino';
import * as singleSpa from 'single-spa';
import fourOhFour from './404';
import TranslationManager from './i18n';
import { setPageTitle } from './setPageMetadata';

export interface II18nConfig {
  use: any[];
  loadNS?: string[];
  ns?: string;
}

export interface IPlugin {
  name: string;
  services: any[];
  i18nConfig: II18nConfig;
  loadingFn: () => Promise<any>;
  activeWhen: {
    exact?: boolean;
    path: string;
  };
  title?: string;
}

export interface IPluginConfig {
  activeWhen?: {
    exact?: boolean;
    path: string;
  };
  title?: string;
}

export interface ILoaderConfig {
  rootNodeId: string;
}

export default class AppLoader {
  public config: ILoaderConfig;
  public plugins: IPlugin[];
  private appLogger;
  private translationManager;
  constructor(config: ILoaderConfig) {
    this.config = config;
    this.plugins = [];
    this.appLogger = pino({ browser: { asObject: true } });
    this.translationManager = new TranslationManager(this.appLogger);
  }

  public async registerPlugin(
    plugin: IPlugin,
    pluginConfig: IPluginConfig,
    sdkModules?: any[],
  ): Promise<void> {
    if (this._validatePlugin(plugin)) {
      if (pluginConfig.activeWhen && pluginConfig.activeWhen.path) {
        plugin.activeWhen = pluginConfig.activeWhen;
      }
      if (pluginConfig.title) {
        plugin.title = pluginConfig.title;
      }
      this.plugins.push(plugin);
      const pluginId = plugin.name.toLowerCase().replace(' ', '-');
      let domEl = document.getElementById(`${pluginId}`);
      const rootEl = document.getElementById(this.config.rootNodeId);
      if (!domEl && rootEl) {
        domEl = document.createElement('div');
        domEl.id = pluginId;
        domEl.style.display = 'inline';
        rootEl.appendChild(domEl);
      }
      const i18nInstance = this.translationManager.createInstance(plugin);
      await i18nInstance.init();
      try {
        singleSpa.registerApplication(
          plugin.name,
          plugin.loadingFn,
          (location: Location): boolean => {
            return this._pathPrefix(location, plugin.activeWhen);
          },
          {
            ...this.config,
            ...pluginConfig,
            domElement: domEl,
            i18n: i18nInstance,
            i18nConfig: plugin.i18nConfig,
            logger: this.appLogger.child({ plugin: pluginId }),
            sdkModules: Object.fromEntries(sdkModules),
          },
        );
        this.appLogger.info(`[@akashaproject/ui-plugin-loader]: ${plugin.name} registered!`);
      } catch (ex) {
        this.appLogger.error('Error registering plugin:', plugin.name, 'error:', ex);
      }
    } else {
      throw new Error(`[@akashaproject/ui-plugin-loader]: Plugin ${plugin.name} is not valid`);
    }
  }

  public start() {
    this.appLogger.info('[@akashaproject/ui-plugin-loader]: starting single spa');
    this._registerSpaListeners();
    singleSpa.start();
  }

  public getPluginsForLocation(location: Location) {
    return singleSpa.checkActivityFunctions(location);
  }

  public getRegisteredPlugins() {
    return this.plugins;
  }

  protected _onFirstMount() {
    const mountTimeEnd = performance.now();
    this.appLogger.info(
      '[AppLoader]: took',
      // @ts-ignore
      (mountTimeEnd - mountTimeStart) / 1000,
      'seconds to load plugins:',
      this.getPluginsForLocation(window.location),
    );
  }

  protected _beforeRouting() {
    const plugins = this.getPluginsForLocation(window.location);
    if (!plugins.length) {
      const rootEl = document.getElementById(this.config.rootNodeId);
      const FourOhFourString: string = fourOhFour(
        this.plugins.reduce((prev, curr): IPlugin[] => {
          prev.push({ title: curr.title, activeWhen: curr.activeWhen });
          return prev;
        }, []),
      );
      rootEl.innerHTML = FourOhFourString;
    } else {
      setPageTitle(
        this.plugins.filter(
          plugin =>
            this.getPluginsForLocation(window.location).includes(plugin.name) && plugin.title,
        ),
      );
    }
  }

  protected _registerSpaListeners() {
    window.addEventListener('single-spa:first-mount', this._onFirstMount.bind(this));
    window.addEventListener('single-spa:before-routing-event', this._beforeRouting.bind(this));
  }

  protected _pathPrefix(location: Location, activeWhen: IPluginConfig['activeWhen']) {
    if (activeWhen && activeWhen.exact) {
      return location.pathname === activeWhen.path;
    }
    return location.pathname.startsWith(`${activeWhen.path}`);
  }

  protected _validatePlugin(plugin: IPlugin): boolean {
    if (Array.isArray(plugin.services)) {
      // check services and return false if they are not ok
      return true;
    }
    return true;
  }
}
