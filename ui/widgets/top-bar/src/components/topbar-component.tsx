import * as React from 'react';
import DS from '@akashaproject/design-system';
import {
  IMenuItem,
  EventTypes,
  MenuItemAreaType,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import {
  useLoginState,
  useErrors,
  useNotifications,
  useProfile,
} from '@akashaproject/ui-awf-hooks';
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

  const [loggedProfileData, loggedProfileActions] = useProfile({
    onError: err => logger.error(err),
    profileService: props.sdkModules.profiles.profileService,
    ipfsService: props.sdkModules.commons.ipfsService,
  });

  const [notificationsState, notificationActions] = useNotifications({
    globalChannel,
    onError: err => logger.error(err),
    authService: props.sdkModules.auth.authService,
    ipfsService: props.sdkModules.commons.ipfsService,
    profileService: props.sdkModules.profiles.profileService,
    loggedEthAddress: loginState.ethAddress,
  });

  React.useEffect(() => {
    if (loginState.ready?.ethAddress && loginState.ethAddress) {
      notificationActions.getMessages();
    }
  }, [loginState.ready?.ethAddress, loginState.ethAddress]);

  React.useEffect(() => {
    if (loginState.pubKey) {
      loggedProfileActions.getProfileData({ pubKey: loginState.pubKey });
    }
  }, [loginState.pubKey]);

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

  const handleLogout = async () => {
    await Promise.resolve(loginActions.logout()).then(_ => {
      navigateToUrl('/');
      setTimeout(() => window.location.reload(), 50);
    });
  };

  const handleModalClose = () => {
    setShowLoginModal(false);
    errorActions.removeLoginErrors();
  };

  const handleSearch = (inputValue: string) => {
    if (searchAreaItem) {
      handleNavigation(`${searchAreaItem.route}/${inputValue}`);
    }
  };

  const { size } = useViewportSize();
  const { t } = useTranslation();

  return (
    <ThemeSelector availableThemes={[lightTheme]} settings={{ activeTheme: 'Light-Theme' }}>
      <Topbar
        avatarImage={loggedProfileData.avatar}
        brandLabel="Ethereum World"
        signInLabel={t('Sign In')}
        signUpLabel={t('Sign Up')}
        signOutLabel={t('Sign Out')}
        searchBarLabel={t('Search profiles or topics')}
        onNavigation={handleNavigation}
        onSearch={handleSearch}
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
        titleLabel={t('Connect a wallet')}
        metamaskModalHeadline={t('Connecting')}
        metamaskModalMessage={t('Please complete the process in your wallet')}
        error={loginErrors}
      />
    </ThemeSelector>
  );
};

export default TopbarComponent;
