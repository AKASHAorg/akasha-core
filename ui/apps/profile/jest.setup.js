const { mockSDK } = require('@akashaorg/af-testing');

require('@testing-library/jest-dom/extend-expect');

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

jest.mock('@akashaorg/awf-sdk', () => {
  return () => mockSDK();
});

jest.mock('@akashaorg/typings/ui', () => ({
  EntityTypes: {
    PROFILE: 1,
  },
  EventTypes: {
    Instantiated: 'instantiated',
    InstallIntegration: 'install-integration',
    RegisterIntegration: 'register-integration',
    UninstallIntegration: 'uninstall-integration',
    ExtensionPointMount: 'extension-point-mount',
    ExtensionPointMountRequest: 'extension-point-mount-request',
    ExtensionPointUnmount: 'extension-point-unmount',
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
}));
