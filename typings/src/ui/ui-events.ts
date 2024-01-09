import { IMenuItem } from './menu-items';
import { ContentBlockRegisterEvent } from './editor-blocks';
import { AnalyticsEventData } from './analytics';
import { ExtensionRegisterEvent } from './extensions';
import { WidgetRegisterEvent } from './widgets';
import { AppRegisterEvent } from './apps';

export const enum RouteRegistrationEvents {
  RegisterRoutes = 'register-routes',
}

export type RoutesRegisterEvent = {
  event: RouteRegistrationEvents;
  data: {
    // name = extension name
    name: string;
    menuItems?: IMenuItem | IMenuItem[];
    navRoutes?: Record<string, string>;
  };
};

export const enum ThemingEvents {
  ThemeChange = 'theme-change',
}

export type ThemingEvent = {
  event: ThemingEvents;
  data: {
    name: string;
  };
};

export const enum NotificationEvents {
  ShowNotification = 'show-notification',
  SnoozeNotifications = 'snooze-notifications',
  UnsnoozeNotifications = 'unsnooze-notifications',
}

export const enum NotificationTypes {
  Info = 'info',
  Alert = 'alert',
  Caution = 'caution',
  Success = 'success',
  Error = 'error',
}

export type NotificationEvent = {
  event: NotificationEvents;
  data?: {
    type: NotificationTypes;
    message: string;
  };
};

export enum EventTypes {
  Instantiated = 'instantiated',
  InstallIntegration = 'install-integration',
  UninstallIntegration = 'uninstall-integration',
  ShowSidebar = 'show-sidebar',
  HideSidebar = 'hide-sidebar',
  ShowWidgets = 'show-widgets',
  HideWidgets = 'hide-widgets',
  LayoutShowLoadingUser = 'layout:show-loading-user',
  SetInitialCookieType = 'set-initial-cookie-type',
  GoBackToPreviousRoute = 'routing:go-back-to-previous-route',
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
  //profile stream id
  profileID?: string;
  isLoggedIn?: boolean;
  followId?: string;
  version?: string;
  itemId?: string;
  reflectId?: string;
  itemType?: EntityTypes;
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
  | AppRegisterEvent
  | RoutesRegisterEvent
  | AnalyticsEventData
  | ThemingEvent
  | NotificationEvent;
