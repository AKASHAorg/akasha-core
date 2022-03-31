import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isMobileOnly } from 'react-device-detect';

import DS from '@akashaproject/design-system';
import {
  EventTypes,
  MenuItemAreaType,
  UIEventData,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import {
  useCheckNewNotifications,
  useGetLogin,
  useGetProfile,
  useLogout,
} from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { Topbar } = DS;

const TopbarComponent: React.FC<RootComponentProps> = props => {
  const { singleSpa, uiEvents } = props;
  const navigateTo = props.plugins.routing?.navigateTo;

  const { navigateToUrl } = singleSpa;
  const location = useLocation();

  const [routeData, setRouteData] = React.useState({});
  // sidebar is open by default on larger screens
  const [sidebarVisible, setSidebarVisible] = React.useState<boolean>(!isMobileOnly ? true : false);

  const loginQuery = useGetLogin();
  const logoutMutation = useLogout();

  const profileDataReq = useGetProfile(loginQuery.data.pubKey, null, loginQuery.isSuccess);
  const loggedProfileData = profileDataReq.data;

  const checkNotifsReq = useCheckNewNotifications(
    loginQuery.data.isReady && loginQuery.data.ethAddress,
  );

  const uiEventsRef = React.useRef(uiEvents);

  React.useEffect(() => {
    const eventsSub = uiEventsRef.current.subscribe({
      next: (eventInfo: UIEventData) => {
        if (eventInfo.event === EventTypes.HideSidebar) {
          setSidebarVisible(false);
        }
        if (eventInfo.event === EventTypes.ShowSidebar) {
          setSidebarVisible(true);
        }
      },
    });

    return () => {
      if (eventsSub) {
        eventsSub.unsubscribe();
      }
    };
  }, []);

  React.useEffect(() => {
    const sub = props.plugins?.routing?.routeObserver?.subscribe({
      next: routeData => {
        setRouteData(routeData?.byArea);
      },
    });

    return () => sub.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quickAccessItems = routeData?.[MenuItemAreaType.QuickAccessArea];
  const otherAreaItems = routeData?.[MenuItemAreaType.OtherArea];

  // sort them so that avatar is last on the topbar menu
  const sortedQuickAccessItems = quickAccessItems?.sort((menuItemA, menuItemB) => {
    if (menuItemA.name && menuItemB.name) {
      const getPluginName = (pluginName: string) => {
        const splitName = pluginName.split('-');
        return splitName[splitName.length - 1];
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

  const handleNavigation = (path: string) => {
    navigateToUrl(path);
  };

  const handleLoginClick = () => {
    /*
     * TODO: This handler along with the buttons
     * in the topbar should be moved to extension points
     */
    navigateTo?.({
      appName: '@akashaproject/app-auth-ewa',
      getNavigationUrl: appRoutes => {
        return `${appRoutes.SignIn}?${new URLSearchParams({
          redirectTo: location.pathname,
        }).toString()}`;
      },
    });
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigateToUrl('/');
    setTimeout(() => window.location.reload(), 50);
  };

  const handleSignUpClick = () => {
    navigateTo?.({
      appName: '@akashaproject/app-auth-ewa',
      getNavigationUrl: appRoutes => appRoutes.SignUp,
    });
  };

  const handleFeedbackModalShow = () => {
    props.navigateToModal({ name: 'feedback' });
  };

  const handleBrandClick = () => {
    if (!props.worldConfig.homepageApp) {
      return;
    }

    const homeAppRoutes = props.getAppRoutes(props.worldConfig.homepageApp);
    if (homeAppRoutes && homeAppRoutes.hasOwnProperty('defaultRoute')) {
      if (location.pathname === homeAppRoutes.defaultRoute) {
        scrollTo(0, 0);
      } else {
        handleNavigation(homeAppRoutes.defaultRoute);
      }
    }
  };

  const { t } = useTranslation('ui-widget-topbar');

  const handleSidebarToggle = () => {
    uiEvents.next({
      event: sidebarVisible ? EventTypes.HideSidebar : EventTypes.ShowSidebar,
    });
  };

  return (
    <Topbar
      loggedProfileData={loggedProfileData}
      brandLabel="Ethereum World"
      signInLabel={t('Sign In')}
      signUpLabel={t('Sign Up')}
      signOutLabel={t('Sign Out')}
      legalLabel={t('Legal')}
      feedbackLabel={t('Send Us Feedback')}
      feedbackInfoLabel={t('Help us improve the experience!')}
      legalCopyRightLabel={'© Ethereum World Association'}
      stuckLabel={t('Stuck?')}
      helpLabel={t('We can help')}
      writeToUs="mailto:alpha@ethereum.world"
      versionLabel="ALPHA"
      versionURL="https://github.com/AKASHAorg/akasha-world-framework/discussions/categories/general"
      sidebarVisible={sidebarVisible}
      onNavigation={handleNavigation}
      onSidebarToggle={handleSidebarToggle}
      quickAccessItems={sortedQuickAccessItems}
      otherAreaItems={otherAreaItems}
      onLoginClick={handleLoginClick}
      onSignUpClick={handleSignUpClick}
      onLogout={handleLogout}
      onFeedbackClick={handleFeedbackModalShow}
      hasNewNotifications={checkNotifsReq.data}
      currentLocation={location?.pathname}
      onBrandClick={handleBrandClick}
      modalSlotId={props.layoutConfig.modalSlotId}
    />
  );
};

export default TopbarComponent;
