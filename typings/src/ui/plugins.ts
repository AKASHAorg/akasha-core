export interface IPluginsMap {
  [namespace: string]: any;
}

export interface PluginConf {
  [namespace: string]: {
    [key: string]: unknown;
  };
}
