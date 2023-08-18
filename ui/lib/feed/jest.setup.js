import { genPostData, mockSDK } from '@akashaorg/af-testing';
import * as mediaHooks from '@akashaorg/ui-awf-hooks/lib/utils/media-utils';

require('@testing-library/jest-dom/extend-expect');

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: () => ({ t: key => key, i18n: { languages: ['en'] } }),
}));

jest.mock('@akashaorg/awf-sdk', () => {
  return () => mockSDK({});
});

jest.mock('@akashaorg/typings/ui', () => ({
  EntityTypes: {
    POST: 0,
    PROFILE: 1,
    REPLY: 2,
    TAG: 3,
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

jest
  .spyOn(mediaHooks, 'getMediaUrl')
  .mockReturnValue({ originLink: '', fallbackLink: '', pathLink: '' });
