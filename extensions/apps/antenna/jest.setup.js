import '../../jest.setup';

jest.mock('@akashaorg/typings/lib/ui', () => ({
  EntityTypes: {
    BEAM: 0,
    PROFILE: 1,
    REFLECT: 2,
    TAG: 3,
    ARTICLE: 4,
  },
  EventTypes: {
    Instantiated: 'instantiated',
    InstallIntegration: 'install-integration',
    RegisterIntegration: 'register-integration',
    UninstallIntegration: 'uninstall-integration',
    ExtensionPointMount: 'extension-point-mount',
    ExtensionPointMountRequest: 'extension-point-mount-request',
    ExtensionPointUnmount: 'extension-point-unmount',
    ExtensionPointUpdate: 'extension-point-update',
    ExtensionPointUnmountRequest: 'extension-point-unmount-request',
    ModalRequest: 'modal-mount-request',
    ModalMount: 'modal-mount',
    ModalUnmount: 'modal-unmount',
    ShowSidebar: 'show-sidebar',
    HideSidebar: 'hide-sidebar',
    LayoutReady: 'layout:ready',
    LayoutShowLoadingUser: 'layout:show-loading-user',
    LayoutShowAppLoading: 'layout:show-app-loading',
    LayoutShowAppNotFound: 'layout:show-app-not-found',
    ThemeChange: 'theme-change',
  },
  NotificationEvents: {
    ShowNotification: 'show-notification',
  },
  AnalyticsCategories: {
    REFLECT: 'Reflect',
  },
  NotificationTypes: {
    Alert: 'alert',
  },
}));
