import { IMenuItem } from './menu-items';
import { ContentBlockRegisterEvent } from './editor-blocks';
import { AnalyticsEventData } from './analytics';
import { ExtensionRegisterEvent } from './extensions';
import { WidgetRegisterEvent } from './widgets';

export enum EventTypes {
  Instantiated = 'instantiated',
  InstallIntegration = 'install-integration',
  RegisterIntegration = 'register-integration',
  UninstallIntegration = 'uninstall-integration',
  ExtensionPointMount = 'extension-point-mount',
  ExtensionPointMountRequest = 'extension-point-mount-request',
  ExtensionPointUnmount = 'extension-point-unmount',
  ExtensionPointUpdate = 'extension-point-update',
  ExtensionPointUnmountRequest = 'extension-point-unmount-request',
  ModalRequest = 'modal-mount-request',
  ModalMount = 'modal-mount',
  ModalUnmount = 'modal-unmount',
  ShowSidebar = 'show-sidebar',
  HideSidebar = 'hide-sidebar',
  ShowWidgets = 'show-widgets',
  HideWidgets = 'hide-widgets',
  SnoozeNotifications = 'snooze-notifications',
  UnsnoozeNotifications = 'unsnooze-notifications',
  ShowNotification = 'show-notification',

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
  BEAM = 0,
  PROFILE = 1,
  REFLECT = 2,
  TAG = 3,
  ARTICLE = 4,
}

/**
 To be used as per example `EntityTypesMap[EntityTypes.BEAM]` to get the name of the entity type
 */
export const EntityTypesMap = {
  [EntityTypes.BEAM]: 'beam',
  [EntityTypes.PROFILE]: 'profile',
  [EntityTypes.REFLECT]: 'reflect',
  [EntityTypes.TAG]: 'tag',
  [EntityTypes.ARTICLE]: 'article',
};

export type EventDataTypes = {
  name: string;
  //profile stream id
  profileID?: string;
  isLoggedIn?: boolean;
  followId?: string;
  version?: string;
  itemId?: string;
  reflectId?: string;
  itemType?: EntityTypes;
  menuItems?: IMenuItem | IMenuItem[];
  navRoutes?: Record<string, string>;
  [key: string]: unknown;
};

// @TODO: split EventTypes with their respective EventDataTypes as the example below
export type UIEventData =
  | {
      event: EventTypes;
      data?: EventDataTypes;
    }
  | ContentBlockRegisterEvent
  | ExtensionRegisterEvent
  | WidgetRegisterEvent
  | AnalyticsEventData;
