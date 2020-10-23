import * as React from 'react';
import DS from '@akashaproject/design-system';
import {
  IMenuItem,
  EventTypes,
  MenuItemAreaType,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import useProfile from '../hooks/use-profile';

const { lightTheme, Topbar, ThemeSelector, useViewportSize, LoginModal, useGlobalLogin } = DS;

interface TopBarProps {
  navigateToUrl: (url: string) => void;
  toggleSidebar: (visible: boolean) => void;
  getMenuItems: () => IMenuItem[];
  ethAddress?: string;
  loaderEvents: any;
  modalSlotId: string;
  onLogin: (provider: 2 | 3) => void;
  globalChannel: any;
  logger: any;
  onGlobalLogin: (ethAddress: string, token: string) => void;
  sdkModules: any;
}

const TopbarComponent = (props: TopBarProps) => {
  const {
    navigateToUrl,
    getMenuItems,
    loaderEvents,
    toggleSidebar,
    ethAddress,
    modalSlotId,
    onLogin,
    globalChannel,
    sdkModules,
    logger,
  } = props;

  const [currentMenu, setCurrentMenu] = React.useState<IMenuItem[]>([]);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [profileState, profileActions] = useProfile({
    onError: err => {
      logger.error(err);
    },
    sdkModules: sdkModules,
  });

  useGlobalLogin(
    globalChannel,
    data => {
      const { ethAddress: ethAddr, token } = data;
      props.onGlobalLogin(ethAddr, token);
    },
    ({ error }) => props.logger.error(error),
  );

  React.useEffect(() => {
    if (ethAddress) {
      profileActions.getProfileData({ ethAddress });
    }
  }, [ethAddress]);

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
    if (ethAddress && showLoginModal) {
      setTimeout(() => setShowLoginModal(false), 500);
    }
  }, [ethAddress, showLoginModal]);

  // *how to obtain different topbar menu sections
  const quickAccessItems = currentMenu?.filter(
    menuItem => menuItem.area === MenuItemAreaType.QuickAccessArea,
  );
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
    onLogin(provider);
  };
  const handleModalClose = () => {
    setShowLoginModal(false);
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

  return (
    <ThemeSelector availableThemes={[lightTheme]} settings={{ activeTheme: 'Light-Theme' }}>
      <Topbar
        avatarImage={profileState.avatar}
        brandLabel="Ethereum World"
        onNavigation={handleNavigation}
        onSearch={handleSearchBarKeyDown}
        onSidebarToggle={toggleSidebar}
        ethAddress={ethAddress}
        quickAccessItems={ethAddress ? quickAccessItems : null}
        searchAreaItem={searchAreaItem}
        size={size}
        onLoginClick={handleLoginClick}
      />
      <LoginModal
        slotId={modalSlotId}
        onLogin={handleLogin}
        onModalClose={handleModalClose}
        showModal={showLoginModal}
        tutorialLinkLabel="Tutorial"
        metamaskModalHeadline="Metamask"
        metamaskModalMessage="Login with Metamask"
        onTutorialLinkClick={handleTutorialLinkClick}
        helpText="What is a wallet? How do i get an Ethereum address?"
      />
    </ThemeSelector>
  );
};

export default TopbarComponent;
