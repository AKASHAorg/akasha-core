import { II18nConfig, SDKdependency } from './app-loader';
export interface LogoSourceType {
    type: LogoTypeSource;
    value: string;
}
export interface Application {
    activeWhen: {
        path: string;
        exact?: boolean;
    };
    i18nConfig: II18nConfig;
    loadingFn: () => Promise<any>;
    name: string;
    sdkModules?: SDKdependency[];
    title: string;
    menuItems?: {
        [p: string]: string;
    };
    logo?: LogoSourceType;
}
export declare enum LogoTypeSource {
    ICON = "icon",
    String = "string",
    IPFS = "ipfs"
}
