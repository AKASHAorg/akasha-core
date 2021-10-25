import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useLocation } from 'react-router-dom';
import {
  IMenuItem,
  EventTypes,
  MenuItemAreaType,
  UIEventData,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import { useCheckNewNotifications } from '@akashaproject/ui-awf-hooks/lib/use-notifications.new';
import { useGetProfile } from '@akashaproject/ui-awf-hooks/lib/use-profile.new';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { extensionPointsMap } from '../extension-points';
import { useGetLogin, useLogout } from '@akashaproject/ui-awf-hooks/lib/use-login.new';
import { useCheckModerator } from '@akashaproject/ui-awf-hooks/lib/use-moderation';

const { lightTheme, Topbar, ThemeSelector, ExtensionPoint } = DS;

const TopbarComponent = (props: RootComponentProps) => {
  const { singleSpa, getMenuItems, uiEvents } = props;

  const { navigateToUrl } = singleSpa;

  const [currentMenu, setCurrentMenu] = React.useState<IMenuItem[]>([]);

  const loginQuery = useGetLogin();
  const logoutMutation = useLogout();

  const profileDataReq = useGetProfile(loginQuery.data.pubKey, null, loginQuery.isSuccess);
  const loggedProfileData = profileDataReq.data;

  const checkNotifsReq = useCheckNewNotifications(
    loginQuery.data.isReady && loginQuery.data.ethAddress,
  );

  const checkModeratorQuery = useCheckModerator(loginQuery.data?.pubKey);

  const checkModeratorResp = checkModeratorQuery.data;

  const isModerator = React.useMemo(() => {
    if (checkModeratorResp === 200) {
      return true;
    } else return false;
  }, [checkModeratorResp]);

  // React.useEffect(() => {
  //   if (loginState.ready?.ethAddress && loginState.ethAddress) {
  //     notificationActions.hasNewNotifications();
  //   }
  // }, [loginState.ready?.ethAddress, loginState.ethAddress]);

  // React.useEffect(() => {
  //   if (loginState.pubKey) {
  //     loggedProfileActions.getProfileData({ pubKey: loginState.pubKey });
  //   }
  // }, [loginState.pubKey]);

  React.useEffect(() => {
    const updateMenu = () => {
      const menuItems = getMenuItems ? getMenuItems() : { items: [] };
      setCurrentMenu(menuItems.items);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  React.useEffect(() => {
    const isLoadingProfile = profileDataReq.isLoading !== undefined && profileDataReq.isLoading;
    if (loginQuery.data?.ethAddress && !isLoadingProfile) {
      if (loggedProfileData && !loggedProfileData.userName) {
        return props.navigateToModal({
          name: 'update-profile',
        });
      }
    }
  }, [
    profileDataReq.isLoading,
    loginQuery.data?.ethAddress,
    loggedProfileData,
    loginQuery.data?.pubKey,
    props,
  ]);

  const handleNavigation = (path: string) => {
    navigateToUrl(path);
  };

  const handleLoginClick = () => {
    props.navigateToModal({ name: 'signin' });
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigateToUrl('/');
    setTimeout(() => window.location.reload(), 50);
  };

  const handleSignUpClick = () => {
    props.navigateToModal({ name: 'signup' });
  };

  const handleFeedbackModalShow = () => {
    props.navigateToModal({ name: 'feedback' });
  };

  const handleModerationClick = () => {
    navigateToUrl('/moderation-app/history');
  };

  const handleDashboardClick = () => {
    navigateToUrl('/moderation-app/home');
  };

  const handleSearch = (inputValue: string) => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;
    const encodedSearchKey = encodeURIComponent(trimmedValue);
    if (searchAreaItem) {
      handleNavigation(`${searchAreaItem.route}/${encodedSearchKey}`);
    }
  };

  const handleBrandClick = () => {
    if (!props.homepageApp) {
      return;
    }
    const homeAppRoutes = props.getAppRoutes(props.homepageApp);
    if (homeAppRoutes && homeAppRoutes.hasOwnProperty('defaultRoute')) {
      if (location.pathname === homeAppRoutes.defaultRoute) {
        scrollTo(0, 0);
      } else {
        handleNavigation(homeAppRoutes.defaultRoute);
      }
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
        isModerator={isModerator}
        dashboardLabel={t('Moderator Dashboard')}
        dashboardInfoLabel={t('Help moderate items!')}
        feedbackLabel={t('Send Us Feedback')}
        feedbackInfoLabel={t('Help us improve the experience!')}
        moderationLabel={t('Moderation History')}
        moderationInfoLabel={t('Help keep us accountable!')}
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
        onModerationClick={handleModerationClick}
        onDashboardClick={handleDashboardClick}
        hasNewNotifications={checkNotifsReq.data}
        currentLocation={location?.pathname}
        onBrandClick={handleBrandClick}
        modalSlotId={props.layoutConfig.modalSlotId}
      >
        <ExtensionPoint
          name={extensionPointsMap.QuickAccess}
          shouldMount={!!loggedProfileData?.ethAddress}
          onMount={name => onExtMount(name)}
          onUnmount={name => onExtUnmount(name)}
        />
      </Topbar>
    </ThemeSelector>
  );
};

export default TopbarComponent;
