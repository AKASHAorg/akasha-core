import '../jest.setup';
import * as mediaHooks from '@akashaorg/ui-awf-hooks/lib/utils/media-utils';
import * as reactUse from 'react-use';

jest
  .spyOn(mediaHooks, 'getProfileImageVersionsWithMediaUrl')
  .mockReturnValue({ defaults: { height: 0, width: 0, src: '' } });

jest.spyOn(reactUse, 'useMedia').mockReturnValue(true);

jest.mock('@akashaorg/typings/ui', () => ({
  EntityTypes: {
    PROFILE: 1,
  },
  LogoTypeSource: {
    ICON: 'icon',
    String: 'string',
    IPFS: 'ipfs',
    AVATAR: 'avatar',
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

jest.mock('@twind/core', () => {
  return {
    tw: () => ({}),
    apply: () => ({}),
    keyframes: () => ({}),
  };
});
