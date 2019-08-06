import * as singleSpa from 'single-spa';

export interface IPlugin {
  name: string;
  services: any[];
  loadingFn: () => Promise<any>;
  activeWhen: {
    exact?: boolean;
    path: string;
  };
}

export interface IPluginConfig {
  activeWhen?: {
    exact?: boolean;
    path: string;
  };
}

export interface ILoaderConfig {
  someLoaderConfig?: boolean;
}

export default class AppLoader {
  public config: ILoaderConfig;
  public plugins: IPlugin[];

  constructor(config: ILoaderConfig) {
    this.config = config;
    this.plugins = [];
  }
  public registerPlugin(plugin: IPlugin, pluginConfig: IPluginConfig): void {
    this.plugins.push(plugin);
    if (this._validatePlugin(plugin)) {
      const pluginId = plugin.name.toLowerCase().replace(' ', '-');
      let domEl = document.getElementById(`${pluginId}`);
      const rootEl = document.getElementById('root');
      if (!domEl && rootEl) {
        domEl = document.createElement('div');
        domEl.id = pluginId;
        rootEl.appendChild(domEl);
      }
      singleSpa.registerApplication(
        plugin.name,
        plugin.loadingFn,
        (location: Location): boolean => {
          let activeWhen = plugin.activeWhen;
          if (pluginConfig.activeWhen && pluginConfig.activeWhen.path) {
            activeWhen = pluginConfig.activeWhen;
          }
          return this._pathPrefix(location, activeWhen);
          return true;
        },
        {
          ...this.config,
          ...pluginConfig,
          domElement: domEl
        }
      );
      // @todo: add logger
      console.info(`[@akashaproject/ui-plugin-loader]: ${plugin.name} registered!`);
    } else {
      throw new Error(`[@akashaproject/ui-plugin-loader]: Plugin ${plugin.name} is not valid`);
    }
  }

  public start() {
    console.info('[@akashaproject/ui-plugin-loader]: starting single spa');
    singleSpa.start();
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
