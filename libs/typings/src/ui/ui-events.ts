import { IMenuItem } from './sidebar-menu-items';
import { ContentBlockRegisterEvent } from './editor-blocks';
import { AnalyticsEventData } from './analytics';
import { ExtensionRegisterEvent } from './extension-point';
import { WidgetRegisterEvent } from './widgets';
import { AppRegisterEvent } from './extensions';

/**
 * Enum defining events related to loading and unloading of global routes
 **/
export const enum RouteRegistrationEvents {
  RegisterRoutes = 'register-routes',
}

/**
 * Type defining route registration event
 **/
export type RoutesRegisterEvent = {
  event: RouteRegistrationEvents;
  data: {
    // name = extension name
    name: string;
    menuItems?: IMenuItem | IMenuItem[];
    navRoutes?: Record<string, string>;
  };
};

/**
 * Enum defining events related to theming
 **/
export const enum ThemingEvents {
  ThemeChange = 'theme-change',
}

/**
 * Type defining theming event object
 **/
export type ThemingEvent = {
  event: ThemingEvents;
  data: {
    name: string;
  };
};

/**
 * Enum defining notification events
 **/
export const enum NotificationEvents {
  ShowNotification = 'show-notification',
  SnoozeNotifications = 'snooze-notifications',
  UnsnoozeNotifications = 'unsnooze-notifications',
}

/**
 * Enum defining notification types
 **/
export const enum NotificationTypes {
  Info = 'info',
  Alert = 'alert',
  Caution = 'caution',
  Success = 'success',
  Error = 'error',
}

/**
 * Type defining notification event object
 **/
export type NotificationEvent = {
  event: NotificationEvents;
  data?: {
    type: NotificationTypes;
    message: string;
    description?: string;
    ctaLabel?: string;
    dismissable?: boolean;
    solidIcon?: boolean;
    accentColor?: boolean;
    handleCTAClick?: () => void;
    snackbarIcon?: React.ReactElement;
  };
};

/**
 * Enum defining global event types
 **/
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

/**
 * Enum defining entity types
 **/
export const enum EntityTypes {
  BEAM = 0,
  PROFILE = 1,
  REFLECT = 2,
  TAG = 3,
  ARTICLE = 4,
}

/**
 * Type defining global event data object
 **/
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

/**
 * Type defining global UI event data object
 **/
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
