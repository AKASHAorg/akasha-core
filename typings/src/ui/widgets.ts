import { ParcelConfigObject } from 'single-spa';
import type { ActivityFn, LayoutConfig } from './app-loader';

export const enum WidgetEvents {
  RegisterWidget = 'register-widget',
}

export type BaseWidgetInterface = {
  mountsIn: string;
  activeWhen?: ActivityFn;
  loadingFn: () => Promise<ParcelConfigObject>;
};

export type WidgetInterface = BaseWidgetInterface & {
  extensionsMap?: Record<string, string>;
};

export type LayoutWidgetInterface = BaseWidgetInterface & {
  extensionsMap: LayoutConfig;
};

export type WidgetRegisterEvent = {
  event: WidgetEvents.RegisterWidget;
  data: WidgetInterface & { appName: string };
};

export interface WidgetStorePlugin {
  getWidgets: () => WidgetInterface[];
  getMatchingWidgets: (
    slotName: string,
    location: Location,
  ) => (WidgetInterface & { appName: string })[];
}
