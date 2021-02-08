import * as React from 'react';
import DS from '@akashaproject/design-system';
import {
  IMenuItem,
  EventTypes,
  MenuItemAreaType,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import { useLoginState, useErrors, useNotifications } from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';

const { lightTheme, Topbar, ThemeSelector, useViewportSize, LoginModal } = DS;

interface TopBarProps {
  navigateToUrl: (url: string) => void;
  toggleSidebar: (visible: boolean) => void;
  getMenuItems: () => IMenuItem[];
  loaderEvents: any;
  modalSlotId: string;
  globalChannel: any;
  logger: any;
  sdkModules: any;
}

const TopbarComponent = (props: TopBarProps) => {
  const {
    navigateToUrl,
    getMenuItems,
    loaderEvents,
    toggleSidebar,
    modalSlotId,
    globalChannel,
    logger,
  } = props;

  const [currentMenu, setCurrentMenu] = React.useState<IMenuItem[]>([]);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [errorState, errorActions] = useErrors({ logger });
  const [loginState, loginActions] = useLoginState({
    globalChannel,
    onError: errorActions.createError,
    ipfsService: props.sdkModules.commons.ipfsService,
    profileService: props.sdkModules.profiles.profileService,
    authService: props.sdkModules.auth.authService,
  });

  const [notificationsState] = useNotifications({
    globalChannel,
    onError: err => logger.error(err),
    authService: props.sdkModules.auth.authService,
    ipfsService: props.sdkModules.commons.ipfsService,
    profileService: props.sdkModules.profiles.profileService,
    loggedEthAddress: loginState.ethAddress,
  });
  const loginErrors: string | null = React.useMemo(() => {
    if (errorState && Object.keys(errorState).length) {
      const txt = Object.keys(errorState)
        .filter(key => key.split('.')[0] === 'useLoginState')
        .map(k => errorState![k])
        .reduce((acc, errObj) => `${acc}\n${errObj.error.message}`, '');
      return txt;
    }
    return null;
  }, [errorState]);

  React.useEffect(() => {
    const updateMenu = () => {
      const menuItems = getMenuItems();
      setCurrentMenu(menuItems);
    };
    updateMenu();
    loaderEvents.subscribe((evMsg: EventTypes) => {
      if (evMsg === EventTypes.AppInstall || evMsg === EventTypes.PluginInstall) {
        updateMenu();
      }
    });
    return function cleanup() {
      loaderEvents.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (loginState.ethAddress && showLoginModal) {
      setTimeout(() => setShowLoginModal(false), 500);
    }
  }, [loginState.ethAddress, showLoginModal]);

  // *how to obtain different topbar menu sections
  const quickAccessItems = currentMenu?.filter(
    menuItem => menuItem.area === MenuItemAreaType.QuickAccessArea,
  );
  // sort them so that avatar is last on the topbar menu
  const sortedQuickAccessItems = quickAccessItems.sort((menuItemA, menuItemB) => {
    if (menuItemA.label.toLowerCase() > menuItemB.label.toLowerCase()) {
      return -1;
    }
    if (menuItemA.label.toLowerCase() < menuItemB.label.toLowerCase()) {
      return 1;
    }
    return 0;
  });
  const searchAreaItem = currentMenu?.filter(
    menuItem => menuItem.area === MenuItemAreaType.SearchArea,
  )[0];

  const handleNavigation = (path: string) => {
    navigateToUrl(path);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };
  const handleLogin = (provider: 2 | 3) => {
    loginActions.login(provider);
  };

  const handleLogout = () => {
    loginActions.logout();
    navigateToUrl('/');
    window.location.reload();
  };
  const handleModalClose = () => {
    setShowLoginModal(false);
    errorActions.removeLoginErrors();
  };
  const handleSearchBarKeyDown = (
    ev: React.KeyboardEvent<HTMLInputElement>,
    inputValue: string,
  ) => {
    if (ev.key === 'Enter' && searchAreaItem) {
      handleNavigation(`${searchAreaItem.route}/${inputValue}`);
    }
  };
  const handleTutorialLinkClick = () => {
    /* goto tutorials */
  };

  const { size } = useViewportSize();
  const { t } = useTranslation();

  return (
    <ThemeSelector availableThemes={[lightTheme]} settings={{ activeTheme: 'Light-Theme' }}>
      <Topbar
        avatarImage={loginState.profileData.avatar}
        brandLabel="Ethereum World"
        signInLabel={t('Sign In')}
        logoutLabel={t('Logout')}
        onNavigation={handleNavigation}
        onSearch={handleSearchBarKeyDown}
        onSidebarToggle={toggleSidebar}
        ethAddress={loginState.ethAddress}
        quickAccessItems={loginState.ethAddress ? sortedQuickAccessItems : null}
        searchAreaItem={searchAreaItem}
        size={size}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
        notifications={notificationsState.notifications}
      />
      <LoginModal
        slotId={modalSlotId}
        onLogin={handleLogin}
        onModalClose={handleModalClose}
        showModal={showLoginModal}
        tutorialLinkLabel={t('Tutorial')}
        metamaskModalHeadline={t('Connecting')}
        metamaskModalMessage={t('Please complete the process in your wallet')}
        onTutorialLinkClick={handleTutorialLinkClick}
        helpText={t('What is a wallet? How do i get an Ethereum address?')}
        error={loginErrors}
      />
    </ThemeSelector>
  );
};

export default TopbarComponent;
