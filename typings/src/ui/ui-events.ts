import { IMenuItem } from './menu-items';

export enum EventTypes {
  Instantiated = 'instantiated',
  InstallIntegration = 'install-integration',
  RegisterIntegration = 'register-integration',
  UninstallIntegration = 'uninstall-integration',
  ExtensionPointMount = 'extension-point-mount',
  ExtensionPointMountRequest = 'extension-point-mount-request',
  ExtensionPointUnmount = 'extension-point-unmount',
  ExtensionPointUnmountRequest = 'extension-point-unmount-request',
  ModalRequest = 'modal-mount-request',
  ModalMount = 'modal-mount',
  ModalUnmount = 'modal-unmount',
  ShowSidebar = 'show-sidebar',
  HideSidebar = 'hide-sidebar',

  /*
   * Events that are handled by the layout widget
   */

  /**
   * `layout:ready` event is fired after first render, when the layout is
   * already subscribed to the event bus. We need this event for the initial load
   * of the world app, when we might have a modal to load.
   */
  LayoutReady = 'layout:ready',
  LayoutShowLoadingUser = 'layout:show-loading-user',
  LayoutShowAppLoading = 'layout:show-app-loading',
  LayoutShowAppNotFound = 'layout:show-app-not-found',
  ThemeChange = 'theme-change',
}

export const enum EntityTypes {
  ENTRY = 'entry',
  PROFILE = 'profile',
  COMMENT = 'comment',
  TAG = 'tag',
}

export type EventDataTypes = {
  name: string;
  version?: string;
  itemId?: string;
  // some parts of the code use this var as EntityTypes and other parts like moderation as string
  itemType?: EntityTypes;
  menuItems?: IMenuItem | IMenuItem[];
  navRoutes?: Record<string, string>;
  [key: string]: unknown;
};

export interface UIEventData {
  event: EventTypes;
  data?: EventDataTypes;
}
