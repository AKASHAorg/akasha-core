import { ParcelConfigObject } from 'single-spa';
import type { ActivityFn, LayoutConfig } from './app-loader';

/**
 * Enum defining events related to loading and unloading of a widget
 **/
export const enum WidgetEvents {
  RegisterWidget = 'register-widget',
}

/**
 * Type defining widget loading base configuration object
 **/
type BaseWidgetInterface = {
  mountsIn: string;
  activeWhen?: ActivityFn;
  loadingFn: () => Promise<ParcelConfigObject>;
};

/**
 * Type defining widget loading configuration object
 **/
export type WidgetInterface = BaseWidgetInterface & {
  extensionsMap?: Record<string, string>;
};

/**
 * Type defining layout widget loading configuration object
 **/
export type LayoutWidgetInterface = BaseWidgetInterface & {
  extensionsMap: LayoutConfig;
};

/**
 * Type defining widget registration event
 **/
export type WidgetRegisterEvent = {
  event: WidgetEvents.RegisterWidget;
  data: WidgetInterface & { appName: string };
};

/**
 * Interface defining widget state store defined as a plugin
 **/
export interface WidgetStorePlugin {
  getWidgets: () => WidgetInterface[];
  getMatchingWidgets: (
    slotName: string,
    location: Location,
  ) => (WidgetInterface & { appName: string })[];
}
