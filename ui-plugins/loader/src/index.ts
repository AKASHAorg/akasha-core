import * as singleSpa from 'single-spa';

export interface IPlugin {
  name: string;
  services: any[];
  loadingFn: () => Promise<any>;
  activeWhen: (location: Location) => boolean;
}

export default class AppLoader {
  public config: object;
  public plugins: IPlugin[];

  constructor(config: object) {
    this.config = config;
    this.plugins = [];
  }

  public registerPlugin(plugin: IPlugin, pluginConfig?: any): void {
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
      singleSpa.registerApplication(plugin.name, plugin.loadingFn, plugin.activeWhen, {
        ...this.config,
        ...pluginConfig,
        domElement: domEl
      });
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

  protected _validatePlugin(plugin: IPlugin): boolean {
    if (Array.isArray(plugin.services)) {
      // check services and return false if they are not ok
      return true;
    }
    return true;
  }
}
