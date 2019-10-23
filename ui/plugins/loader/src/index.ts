import { i18n as i18nType } from 'i18next';
import pino from 'pino';
import * as singleSpa from 'single-spa';
import fourOhFour from './404';
import TranslationManager from './i18n';
import { IPlugin, IWidget } from './interfaces';
import { setPageTitle } from './setPageMetadata';
import { validatePlugin, validateWidget } from './validations';

export interface IPluginConfig {
  activeWhen?: {
    exact?: boolean;
    path: string;
  };
  title?: string;
}

export interface ILoaderConfig {
  rootNodeId: string;
  layout: IWidget;
}

interface IWidgetInfo {
  widget: IWidget;
  sdkModules: any[];
  config: IWidgetConfig;
}
interface IWidgetConfig {
  slot: string;
}
interface IPluginMap {
  plugin: IPlugin;
  config: IPluginConfig;
  pluginId: string;
  sdkModules?: any[];
}

export default class AppLoader {
  public config: ILoaderConfig;
  public plugins: IPluginMap[];
  public rootWidgets: Map<string, IWidgetInfo>;
  private appLogger;
  private translationManager;
  private layout;
  constructor(config: ILoaderConfig) {
    this.config = config;
    this.plugins = [];
    this.appLogger = pino({ browser: { asObject: true } });
    this.translationManager = new TranslationManager(this.appLogger);
    this.rootWidgets = new Map();
    this.layout = config.layout;
  }

  public async registerPlugin(
    plugin: IPlugin,
    pluginConfig: IPluginConfig | null,
    sdkModules?: any[],
  ): Promise<void> {
    if (validatePlugin(plugin)) {
      if (pluginConfig && pluginConfig.activeWhen && pluginConfig.activeWhen.path) {
        plugin.activeWhen = pluginConfig.activeWhen;
      }
      if (pluginConfig && pluginConfig.title) {
        plugin.title = pluginConfig.title;
      }
      const pluginId = plugin.name.toLowerCase().replace(' ', '-');
      this.translationManager.createInstance(plugin);
      this.plugins.push({ plugin, config: pluginConfig, pluginId, sdkModules });
    } else {
      throw new Error(`[@akashaproject/ui-plugin-loader]: Plugin ${plugin.name} is not valid`);
    }
  }

  public registerWidget(widget: IWidget, config: IWidgetConfig, sdkModules: any[]) {
    this.appLogger.info(`[@akashaproject/ui-plugin-loader] registering widget ${widget.name}`);
    if (this.rootWidgets.has(widget.name)) {
      this.appLogger.error(
        `[@akashaproject/ui-plugin-loader]: there is already a widget with name ${widget.name}`,
      );
      return;
    }
    this.rootWidgets.set(widget.name, { widget, config, sdkModules });
  }

  public async loadRootWidgets() {
    const promises = Array.from(this.rootWidgets.values()).map(async widgetInfo => {
      const { widget, config } = widgetInfo;
      const domEl = document.getElementById(config.slot);
      const i18nInstance = await this.translationManager.createInstance(widget);
      if (validateWidget(widget)) {
        try {
          singleSpa.mountRootParcel(this.beforeMount(widget.loadingFn, widget), {
            ...this.config,
            ...widgetInfo.widget,
            domElement: domEl,
            i18n: i18nInstance,
          });
          return Promise.resolve();
        } catch (ex) {
          return Promise.reject(
            `[AppLoader] cannot load widget ${widgetInfo.widget.name}: ${ex.message}`,
          );
        }
      } else {
        throw new Error(`[@akashaproject/ui-plugin-loader]: Plugin ${widget.name} is not valid`);
      }
    });
    return Promise.all(promises);
  }
  public async loadLayout() {
    const domEl = document.getElementById(this.config.rootNodeId);
    if (!domEl) {
      this.appLogger.info(
        '[@akashaproject/ui-plugin-loader]: dom element was not found, retrying...',
      );
      throw new Error('[@akashaproject/ui-plugin-loader]: root node element not found!');
    }
    const { loadingFn, ...otherProps } = this.layout;
    const layoutWidget = singleSpa.mountRootParcel(loadingFn, {
      domElement: domEl,
      ...otherProps,
    });
    return layoutWidget.mountPromise.catch(err => {
      throw new Error(`[@akashaproject/ui-plugin-loader]: failed to load layout. ${err}`);
    });
  }

  public registerSpaPlugins(): void {
    this.plugins.forEach((pluginMap: IPluginMap) => {
      const { pluginId, plugin, config, sdkModules } = pluginMap;
      const domEl = document.getElementById(this.layout.pluginSlotId);
      try {
        singleSpa.registerApplication(
          plugin.name,
          this.beforeMount(plugin.loadingFn, plugin),
          (location: Location): boolean => {
            return this._pathPrefix(location, plugin.activeWhen);
          },
          {
            ...this.config,
            ...config,
            activeWhen: plugin.activeWhen,
            domElement: domEl,
            i18n: this.translationManager.getInstance(plugin.name),
            i18nConfig: plugin.i18nConfig,
            logger: this.appLogger.child({ plugin: pluginId }),
            sdkModules: sdkModules ? Object.fromEntries(sdkModules) : [],
          },
        );
        this.appLogger.info(`[@akashaproject/ui-plugin-loader]: ${plugin.name} registered!`);
      } catch (ex) {
        this.appLogger.error('Error registering plugin:', plugin.name, 'error:', ex);
        throw new Error(ex.message);
      }
    });
  }

  public start() {
    this._registerSpaListeners();
    this.loadLayout()
      .then(() => this.loadRootWidgets())
      .then(() => this.registerSpaPlugins())
      .then(() => {
        this.appLogger.info('[@akashaproject/ui-plugin-loader]: starting single spa');
        // console.log('starting single spa', singleSpa.getAppNames());
        singleSpa.start();
      })
      .catch(err => {
        this.appLogger.error(err.message);
        throw new Error(err.message);
      });
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
    const handleNavigation = (path: string) => (ev: Event) => {
      singleSpa.navigateToUrl(path);
      ev.preventDefault();
    };
    const fourOhFourElem = document.getElementById('four-oh-four');
    // cleanup 404 element if exist (recovering from a 404 page)
    if (fourOhFourElem) {
      fourOhFourElem.parentElement.removeChild(fourOhFourElem);
    }
    if (!plugins.length) {
      const pluginsNode = document.getElementById(this.layout.pluginSlotId);
      // create a 404 page and return it instead of a plugin
      const FourOhFourNode: ChildNode = fourOhFour(
        this.plugins.reduce((prev, curr): IPluginMap[] => {
          prev.push({ title: curr.plugin.title, activeWhen: curr.plugin.activeWhen });
          return prev;
        }, []),
        handleNavigation,
      );
      if (pluginsNode) {
        pluginsNode.appendChild(FourOhFourNode);
      }
    } else {
      setPageTitle(
        this.plugins.filter(
          pluginMap =>
            this.getPluginsForLocation(window.location).includes(pluginMap.plugin.name) &&
            pluginMap.plugin.title,
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

  // private async createRootNodes(name: string) {
  //   let domEl = document.getElementById(`${name}`);
  //   const rootEl = document.getElementById(this.config.rootNodeId);
  //   if (!domEl && rootEl) {
  //     domEl = document.createElement('div');
  //     domEl.id = name;
  //     domEl.style.display = 'flex';
  //     domEl.style.flexDirection = 'column';
  //     rootEl.appendChild(domEl);
  //   }
  //   return Promise.resolve(domEl);
  // }

  private beforeMount(
    loadingFn: { (): Promise<any>; (): void },
    plugin: IPlugin | IWidget,
  ): () => Promise<any> {
    return () => {
      return this.translationManager.initI18nFor(plugin).then(() => loadingFn());
    };
  }
}
