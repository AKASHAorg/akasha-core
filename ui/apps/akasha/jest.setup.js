import { genLoggedInState, genPostData, genCommentData, mockSDK } from '@akashaorg/af-testing';
import * as postHooks from '@akashaorg/ui-awf-hooks/lib/use-posts';
import * as commentHooks from '@akashaorg/ui-awf-hooks/lib/use-comments';
import * as loginHooks from '@akashaorg/ui-awf-hooks/lib/use-login';
import * as mediaHooks from '@akashaorg/ui-awf-hooks/lib/utils/media-utils';

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

jest.spyOn(console, 'error').mockImplementation(jest.fn);

jest
  .spyOn(mediaHooks, 'getMediaUrl')
  .mockReturnValue({ originLink: '', fallbackLink: '', pathLink: '' });

jest.spyOn(postHooks, 'usePost').mockReturnValue({
  data: { ...genPostData() },
  status: 'success',
  isSuccess: true,
  reported: true,
});

jest.spyOn(commentHooks, 'useComment').mockReturnValue({
  data: { ...genCommentData() },
  status: 'success',
  isSuccess: true,
  reported: true,
});

jest.spyOn(loginHooks, 'useGetLogin').mockReturnValue({
  data: { ...genLoggedInState(true) },
  status: 'success',
  isSuccess: true,
  reported: true,
});

const mockIntersectionObserver = jest.fn();

mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});

global.IntersectionObserver = mockIntersectionObserver;
