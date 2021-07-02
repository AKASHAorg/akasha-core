import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useLocation } from 'react-router-dom';
import {
  IMenuItem,
  EventTypes,
  MenuItemAreaType,
  UIEventData,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import {
  useLoginState,
  useErrors,
  useNotifications,
  useProfile,
} from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { extensionPointsMap } from '../extension-points';

const { lightTheme, Topbar, ThemeSelector, ExtensionPoint } = DS;

const TopbarComponent = (props: RootComponentProps) => {
  const { singleSpa, getMenuItems, uiEvents, logger } = props;

  const { navigateToUrl } = singleSpa;

  const [currentMenu, setCurrentMenu] = React.useState<IMenuItem[]>([]);

  const [, errorActions] = useErrors({ logger });

  const [loginState, loginActions] = useLoginState({
    onError: errorActions.createError,
  });

  const [loggedProfileData, loggedProfileActions] = useProfile({
    onError: err => logger.error(err),
  });

  const [notificationsState, notificationActions] = useNotifications({
    onError: err => logger.error(err),

    loggedEthAddress: loginState.ethAddress,
  });

  React.useEffect(() => {
    if (loginState.ready?.ethAddress && loginState.ethAddress) {
      notificationActions.hasNewNotifications();
    }
  }, [loginState.ready?.ethAddress, loginState.ethAddress]);

  React.useEffect(() => {
    if (loginState.pubKey) {
      loggedProfileActions.getProfileData({ pubKey: loginState.pubKey });
    }
  }, [loginState.pubKey]);

  React.useEffect(() => {
    const updateMenu = () => {
      const menuItems = getMenuItems ? getMenuItems() : [];
      setCurrentMenu(menuItems);
    };
    updateMenu();
    const sub = uiEvents.subscribe({
      next: (eventData: UIEventData) => {
        if (
          eventData.event === EventTypes.InstallIntegration ||
          eventData.event === EventTypes.UninstallIntegration
        ) {
          updateMenu();
        }
      },
    });
    return () => sub.unsubscribe();
  }, []);

  React.useEffect(() => {
    const isLoadingProfile =
      loggedProfileData.isLoading !== undefined && loggedProfileData.isLoading;
    if (loginState.ethAddress && !isLoadingProfile) {
      if (!loggedProfileData.userName) {
        return props.singleSpa.navigateToUrl('/profile/my-profile/update-info');
      }
    }
  }, [loggedProfileData.isLoading, loginState.ethAddress]);

  // *how to obtain different topbar menu sections
  const quickAccessItems = currentMenu?.filter(
    menuItem => menuItem.area === MenuItemAreaType.QuickAccessArea,
  );
  // sort them so that avatar is last on the topbar menu
  const sortedQuickAccessItems = quickAccessItems.sort((menuItemA, menuItemB) => {
    if (menuItemA.name && menuItemB.name) {
      const getPluginName = (pluginName: string) => {
        const splitName = pluginName.split('-');
        const name = splitName[splitName.length - 1];
        return name;
      };

      if (getPluginName(menuItemA.name) > getPluginName(menuItemB.name)) {
        return 1;
      }
      if (getPluginName(menuItemA.name) < getPluginName(menuItemB.name)) {
        return -1;
      }
    }

    return 0;
  });

  const searchAreaItem = currentMenu?.filter(
    menuItem => menuItem.area === MenuItemAreaType.SearchArea,
  )[0];

  const otherAreaItems = currentMenu?.filter(
    menuItem => menuItem.area === MenuItemAreaType.OtherArea,
  );

  const handleNavigation = (path: string) => {
    navigateToUrl(path);
  };

  const handleLoginClick = () => {
    props.navigateToModal({ name: 'signin' });
  };

  const handleLogout = async () => {
    await Promise.resolve(loginActions.logout()).then(_ => {
      navigateToUrl('/');
      setTimeout(() => window.location.reload(), 50);
    });
  };

  const handleSignUpClick = () => {
    props.navigateToModal({ name: 'signup' });
  };

  const handleFeedbackModalShow = () => {
    props.navigateToModal({ name: 'feedback' });
  };

  const handleSearch = (inputValue: string) => {
    const encodedSearchKey = encodeURIComponent(inputValue);
    if (searchAreaItem) {
      handleNavigation(`${searchAreaItem.route}/${encodedSearchKey}`);
    }
  };

  const { t } = useTranslation();
  const location = useLocation();

  const onExtMount = (name: string) => {
    uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: {
        name,
      },
    });
  };

  const onExtUnmount = (name: string) => {
    uiEvents.next({
      event: EventTypes.ExtensionPointUnmount,
      data: {
        name,
      },
    });
  };

  return (
    <ThemeSelector availableThemes={[lightTheme]} settings={{ activeTheme: 'Light-Theme' }}>
      <Topbar
        loggedProfileData={loggedProfileData}
        brandLabel="Ethereum World"
        signInLabel={t('Sign In')}
        signUpLabel={t('Sign Up')}
        signOutLabel={t('Sign Out')}
        searchBarLabel={t('Search profiles or topics')}
        legalLabel={t('Legal')}
        feedbackLabel={t('Send Us Feedback')}
        feedbackInfoLabel={t('Help us improve the experience!')}
        legalCopyRightLabel={'© Ethereum World Association'}
        versionLabel="ALPHA"
        versionURL="https://github.com/AKASHAorg/akasha-world-framework/discussions/categories/general"
        onNavigation={handleNavigation}
        onSearch={handleSearch}
        quickAccessItems={sortedQuickAccessItems}
        searchAreaItem={searchAreaItem}
        otherAreaItems={otherAreaItems}
        onLoginClick={handleLoginClick}
        onSignUpClick={handleSignUpClick}
        onLogout={handleLogout}
        onFeedbackClick={handleFeedbackModalShow}
        hasNewNotifications={notificationsState.hasNewNotifications}
        currentLocation={location?.pathname}
      >
        <ExtensionPoint
          name={extensionPointsMap.QuickAccess}
          shouldMount={!!loggedProfileData.ethAddress}
          onMount={name => onExtMount(name)}
          onUnmount={name => onExtUnmount(name)}
        />
      </Topbar>
    </ThemeSelector>
  );
};

export default TopbarComponent;
