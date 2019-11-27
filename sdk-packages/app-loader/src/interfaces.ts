export interface II18nConfig {
  use: any[];
  loadNS?: string[];
  ns?: string;
}

export interface IPlugin {
  name: string;
  services?: any[];
  i18nConfig: II18nConfig;
  loadingFn: () => Promise<any>;
  activeWhen: {
    exact?: boolean;
    path: string;
  };
  title?: string;
}

export interface IWidget {
  name: string;
  i18nConfig?: II18nConfig;
  loadingFn: () => Promise<any>;
  pluginSlotId?: string;
  topbarSlotId?: string;
  sidebarSlotId?: string;
  services?: any[];
}
