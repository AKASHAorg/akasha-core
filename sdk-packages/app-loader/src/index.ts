import pino from 'pino';
import * as singleSpa from 'single-spa';
import fourOhFour from './404';
import TranslationManager from './i18n';
import { IMenuItem, IMenuList, IPlugin, IWidget, MenuItemType } from './interfaces';
import { setPageTitle } from './setPageMetadata';

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

interface IWidgetConfig {
  slot: string;
}
export interface SDKdependency {
  module: string;
  services?: string[];
}
export interface IPluginEntry {
  app: IPlugin;
  config?: IPluginConfig;
  sdkModules?: SDKdependency[];
}

export interface IWidgetEntry {
  app: IWidget;
  config?: IWidgetConfig;
  sdkModules?: any[];
}

interface IAppLoader {
  registerPlugin(plugin: IPluginEntry): void;

  registerWidget(widget: IWidgetEntry): void;

  getPluginsForLocation(location: Location): string[];
}

export default class AppLoader implements IAppLoader {
  public readonly registeredPlugins: Map<string, IPluginConfig>;
  public readonly registeredWidgets: Map<string, IWidgetConfig>;
  private readonly config: ILoaderConfig;
  private readonly appLogger;
  private readonly channels;
  private readonly channelUtils;
  private readonly menuItems: IMenuList;
  private readonly translationManager: TranslationManager;

  public constructor(
    config: ILoaderConfig,
    initialApps: { plugins?: IPluginEntry[]; widgets?: IWidgetEntry[] },
    channels?: any,
    channelUtils?: any,
  ) {
    this.config = config;
    this.channels = channels;
    this.channelUtils = channelUtils;
    this.menuItems = { nextIndex: 1, items: [] };
    this.appLogger = pino({ browser: { asObject: true } });
    this.translationManager = new TranslationManager(this.appLogger);
    this.registeredPlugins = new Map<string, IPluginConfig>();
    this.registeredWidgets = new Map<string, IWidgetConfig>();
    // tslint:disable-next-line:no-console
    console.time('AppLoader:firstMount');
    window.addEventListener('single-spa:first-mount', this.onFirstMount.bind(this));
    window.addEventListener('single-spa:before-routing-event', this.beforeRouting.bind(this));
    this.loadLayout().then(async () => {
      if (initialApps.plugins) {
        initialApps.plugins.forEach(plugin => this.registerPlugin(plugin));
      }
      if (initialApps.widgets) {
        initialApps.widgets.forEach(widget => this.registerWidget(widget));
      }

      this.appLogger.info('[@akashaproject/sdk-ui-plugin-loader]: starting single spa');
      // call on next tick
      setTimeout(singleSpa.start, 0);
    });
  }

  public getPluginsForLocation(location: Location) {
    return singleSpa.checkActivityFunctions(location);
  }

  public registerPlugin(plugin: IPluginEntry): void {
    this.appLogger.info(
      `[@akashaproject/sdk-ui-plugin-loader] registering plugin ${plugin.app.name}`,
    );
    if (plugin.config && plugin.config.activeWhen && plugin.config.activeWhen.path) {
      plugin.app.activeWhen = plugin.config.activeWhen;
    }

    if (plugin.config && plugin.config.title) {
      plugin.app.title = plugin.config.title;
    }

    const pluginId = plugin.app.name.toLowerCase().replace(' ', '-');
    if (this.registeredPlugins.has(pluginId)) {
      this.appLogger.error(`Plugin ${pluginId} already registered`);
      return;
    }
    this.translationManager.createInstance(
      plugin.app,
      this.appLogger.child({ i18nPlugin: pluginId }),
    );
    plugin.app.name = pluginId;
    this.registeredPlugins.set(pluginId, { title: plugin.app.title || pluginId });
    const dependencies = {};
    // @Todo: refactor this
    if (plugin.app.sdkModules.length) {
      for (const dep of plugin.app.sdkModules) {
        if (this.channels.hasOwnProperty(dep.module)) {
          Object.assign(dependencies, { [dep.module]: this.channels[dep.module] });
          this.appLogger.info(`${pluginId} has access to ${dep.module} -> channel`);
        }
      }
    }
    this.appLogger.info(`plugin ${pluginId} `);
    const domEl = document.getElementById(this.config.layout.pluginSlotId);
    singleSpa.registerApplication(
      plugin.app.name,
      this.beforeMount(plugin.app.loadingFn, plugin.app),
      (location: Location): boolean => {
        return this.pathPrefix(location, plugin.app.activeWhen);
      },
      {
        ...this.config,
        ...plugin.config,
        activeWhen: plugin.app.activeWhen,
        domElement: domEl,
        i18n: this.translationManager.getInstance(pluginId),
        i18nConfig: plugin.app.i18nConfig,
        logger: this.appLogger.child({ plugin: pluginId }),
        sdkModules: dependencies,
        channelUtils: this.channelUtils,
      },
    );
    this.menuItems.items.push({
      label: plugin.app.title,
      index: this.menuItems.nextIndex,
      route: plugin.app.activeWhen.path,
      type: MenuItemType.Plugin,
      logo: plugin.app.logo,
      subRoutes: this.createSubroutes(plugin.app.menuItems),
    });
    this.menuItems.nextIndex += 1;
    this.appLogger.info(`[@akashaproject/sdk-ui-plugin-loader]: ${plugin.app.name} registered!`);
  }

  private createSubroutes(subRoutes: IPlugin['menuItems']): IMenuItem[] {
    const routes = [];
    let currentIndex = 0;
    if (!subRoutes) {
      return routes;
    }
    for (const [label, route] of Object.entries(subRoutes)) {
      routes.push({
        index: currentIndex,
        label: label,
        route: route,
        type: MenuItemType.Internal,
      });
      currentIndex += 1;
    }
    return routes;
  }

  public getMenuItems() {
    return this.menuItems.items.slice(0);
  }
  public registerWidget(widget: IWidgetEntry): void {
    this.appLogger.info(
      `[@akashaproject/sdk-ui-plugin-loader] registering widget ${widget.app.name}`,
    );
    const widgetId = widget.app.name.toLowerCase().replace(' ', '-');
    widget.app.name = widgetId;
    if (this.registeredWidgets.has(widgetId)) {
      this.appLogger.error(`Widget ${widgetId} already registered`);
      return;
    }
    this.registeredWidgets.set(widgetId, { slot: widget.config.slot });
    const domEl = document.getElementById(widget.config.slot);
    const i18nInstance = this.translationManager.createInstance(
      widget.app,
      this.appLogger.child({ i18nWidget: widgetId }),
    );

    singleSpa.mountRootParcel(this.beforeMount(widget.app.loadingFn, widget.app), {
      ...this.config,
      ...widget.app,
      domElement: domEl,
      i18n: i18nInstance,
    });
    this.appLogger.info(`[@akashaproject/sdk-ui-plugin-loader]: ${widget.app.name} registered!`);
  }

  public async loadLayout() {
    const domEl = document.getElementById(this.config.rootNodeId);
    if (!domEl) {
      this.appLogger.error(
        '[@akashaproject/sdk-ui-plugin-loader]: dom element was not found, retrying...',
      );
      throw new Error('[@akashaproject/sdk-ui-plugin-loader]: root node element not found!');
    }
    const { loadingFn, ...otherProps } = this.config.layout;
    // this is very important to wait on for dom
    await new Promise(resolve => {
      singleSpa.mountRootParcel(loadingFn, {
        domElement: domEl,
        ...otherProps,
        themeReadyEvent: () => {
          resolve();
        },
      });
    });
  }

  public async uninstallApp(appName: string, packageLoader: any, packageId: string) {
    if (this.registeredPlugins.has(appName)) {
      await singleSpa.unloadApplication(appName, { waitForUnmount: true });
      this.registeredPlugins.delete(appName);
      this.appLogger.info(`removed ${appName} from registeredPlugins`);
    }
    if (this.registeredWidgets.has(appName)) {
      this.appLogger.warn(`trying to unmount root widget ${appName}, which is not supported`);
    }
    const removedPackage = packageLoader.delete(packageId);
    this.appLogger.info(`package ${packageId} removed ${removedPackage}`);
    return;
  }

  protected onFirstMount() {
    // tslint:disable-next-line:no-console
    console.timeEnd('AppLoader:firstMount');
  }

  protected beforeRouting() {
    const currentPlugins = this.getPluginsForLocation(window.location);
    const fourOhFourElem = document.getElementById('four-oh-four');
    // cleanup 404 element if exist (recovering from a 404 page)
    if (fourOhFourElem) {
      fourOhFourElem.parentElement.removeChild(fourOhFourElem);
    }
    if (!currentPlugins.length) {
      const pluginsNode = document.getElementById(this.config.layout.pluginSlotId);
      // create a 404 page and return it instead of a plugin
      const FourOhFourNode: ChildNode = fourOhFour();
      if (pluginsNode) {
        pluginsNode.appendChild(FourOhFourNode);
      }
      return;
    }

    this.appLogger.info(`active plugin`, currentPlugins);
    const firstPlugin = currentPlugins.find(plugin => this.registeredPlugins.has(plugin));
    if (firstPlugin) {
      setPageTitle(this.registeredPlugins.get(firstPlugin).title);
    } else {
      this.appLogger.warn(
        `could not find a registered active app from active plugins list`,
        currentPlugins,
      );
    }
  }

  private beforeMount(
    loadingFn: { (): Promise<any>; (): void },
    plugin: IPlugin | IWidget,
  ): () => Promise<any> {
    return () => {
      return this.translationManager.initI18nFor(plugin).then(() => loadingFn());
    };
  }

  private pathPrefix(location: Location, activeWhen: IPluginConfig['activeWhen']) {
    if (activeWhen && activeWhen.exact) {
      return location.pathname === activeWhen.path;
    }
    return location.pathname.startsWith(`${activeWhen.path}`);
  }
}
