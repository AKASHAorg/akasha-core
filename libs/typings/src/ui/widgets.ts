import { ParcelConfigObject } from 'single-spa';
import type { ExtensionActivity, LayoutSlots } from './app-loader';

/**
 * Type defining widget loading base configuration object
 **/
type BaseWidgetInterface = {
  mountsIn: string;
  activeWhen?: ExtensionActivity;
  loadingFn: () => Promise<ParcelConfigObject>;
};

/**
 * Type defining widget loading configuration object
 **/
export type WidgetInterface = BaseWidgetInterface & {
  extensionSlots?: Record<string, string>;
};

/**
 * Type defining layout widget loading configuration object
 **/
export type LayoutWidgetInterface = BaseWidgetInterface & {
  extensionSlots: LayoutSlots;
};

/**
 * Interface defining widget state store defined as a plugin
 **/
export interface WidgetStorePlugin {
  getWidgets: () => WidgetInterface[];
  onWidgetUnload: (name: string, callback: () => void) => void;
  getMatchingWidgets: (
    slotName: string,
    location: Location,
  ) => (WidgetInterface & { appName: string })[];
}
