import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import {
  EventTypes,
  IMenuItem,
  MenuItemAreaType,
  UIEventData,
  RootComponentProps,
} from '@akashaorg/typings/ui';
import { useGetLogin, useGetProfile, useLogout } from '@akashaorg/ui-awf-hooks';

const { Topbar } = DS;

const TopbarComponent: React.FC<RootComponentProps> = props => {
  const { uiEvents } = props;
  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const location = useLocation();

  const [routeData, setRouteData] = React.useState({});
  // sidebar is open by default on larger screens >=1440px
  const [sidebarVisible, setSidebarVisible] = React.useState<boolean>(
    window.matchMedia('(min-width: 1440px)').matches ? true : false,
  );

  const loginQuery = useGetLogin();
  const logoutMutation = useLogout();

  const profileDataReq = useGetProfile(loginQuery.data.pubKey, null, loginQuery.isSuccess);
  const loggedProfileData = profileDataReq.data;

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
    const sub = props.plugins['@akashaorg/app-routing']?.routing?.routeObserver?.subscribe({
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
    navigateTo?.({
      getNavigationUrl: () => path,
    });
  };

  const handleLoginClick = () => {
    /*
     * TODO: This handler along with the buttons
     * in the topbar should be moved to extension points
     */
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: appRoutes => {
        return `${appRoutes.SignIn}?${new URLSearchParams({
          redirectTo: location.pathname,
        }).toString()}`;
      },
    });
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigateTo?.({
      appName: props.worldConfig.homepageApp,
    });
    setTimeout(() => window.location.reload(), 50);
  };

  const handleSignUpClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: appRoutes => appRoutes.SignUp,
    });
  };

  const handleFeedbackModalShow = () => {
    props.navigateToModal({ name: 'feedback-modal' });
  };

  const handleBrandClick = () => {
    if (!props.worldConfig.homepageApp) {
      return;
    }

    props.plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: props.worldConfig.homepageApp,
      getNavigationUrl: appRoutes => {
        if (appRoutes.hasOwnProperty('defaultRoute')) {
          // if the current pathname is the same as the one we want to navigate to,
          // it means that we want to scroll to the top of the page
          if (
            location.pathname ===
            `/${props.encodeAppName(props.worldConfig.homepageApp)}${appRoutes.defaultRoute}`
          ) {
            scrollTo(0, 0);
          }
          return appRoutes.defaultRoute;
        }
      },
    });
  };

  const { t } = useTranslation('ui-widget-topbar');

  const handleSidebarToggle = () => {
    uiEvents.next({
      event: sidebarVisible ? EventTypes.HideSidebar : EventTypes.ShowSidebar,
    });
  };
  const handleMyProfileClick = () => {
    props.plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: routes => {
        return routes.myProfile;
      },
    });
  };
  const handleLegalClick = (menuItem: IMenuItem) => {
    return props.plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-legal',
      getNavigationUrl: () => menuItem.route || '/',
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
      onMyProfileClick={handleMyProfileClick}
      onLegalClick={handleLegalClick}
      onSidebarToggle={handleSidebarToggle}
      quickAccessItems={sortedQuickAccessItems}
      otherAreaItems={otherAreaItems}
      onLoginClick={handleLoginClick}
      onSignUpClick={handleSignUpClick}
      onLogout={handleLogout}
      onFeedbackClick={handleFeedbackModalShow}
      currentLocation={location?.pathname}
      onBrandClick={handleBrandClick}
      modalSlotId={props.layoutConfig.modalSlotId}
    />
  );
};

export default TopbarComponent;
