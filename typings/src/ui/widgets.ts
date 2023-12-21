import { ParcelConfigObject } from 'single-spa';
import { ActivityFn } from './app-loader';

export const enum WidgetEvents {
  RegisterWidget = 'register-widget',
}

export type WidgetInterface = {
  mountsIn: string;
  activeWhen?: ActivityFn;
  loadingFn: () => Promise<ParcelConfigObject>;
  extensionsMap?: Record<string, string>;
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
