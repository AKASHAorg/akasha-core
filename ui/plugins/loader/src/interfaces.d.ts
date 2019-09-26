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
  loadingFn: () => Promise<any>;
  services?: any[];
}
