import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { isMobileOnly } from 'react-device-detect';

import DS from '@akashaproject/design-system';
import { useGetLogin } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import {
  EventTypes,
  MenuItemAreaType,
  UIEventData,
} from '@akashaproject/ui-awf-typings/lib/app-loader';

const { styled, Sidebar, useViewportSize } = DS;

const AppSidebar = styled(Sidebar)`
  height: calc(100vh - 3rem);
  min-width: 15em;
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    min-width: 13em;
    margin-right: 0.8rem;
  }
  @media screen and (min-width: ${props => props.theme.breakpoints.large.value}px) {
    max-width: 17em;
  }
`;

const SidebarComponent: React.FC<RootComponentProps> = props => {
  const {
    uiEvents,
    plugins: { routing },
  } = props;

  const [routeData, setRouteData] = React.useState({});
  // sidebar is open by default on larger screens
  const [sidebarVisible, setSidebarVisible] = React.useState<boolean>(!isMobileOnly ? true : false);

  const { t } = useTranslation('ui-widget-sidebar');

  const currentLocation = useLocation();

  const { size } = useViewportSize();

  const loginQuery = useGetLogin();

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

  const worldApps = routeData?.[MenuItemAreaType.AppArea];

  // filter out profile menu for guests
  const filteredWorldApps = !loginQuery.data.ethAddress
    ? worldApps?.filter(app => app.name !== '@akashaproject/app-profile')
    : worldApps;

  const handleNavigation = (appName: string, route: string) => {
    routing.navigateTo({
      appName,
      getNavigationUrl: () => route,
    });
  };

  const handleClickExplore = () => {
    // find IC app from world apps
    // @TODO: replace string with a constant
    const icApp = worldApps.find(app => app.label === 'Integration Center');

    // if found, navigate to route
    if (icApp) {
      routing.navigateTo({
        appName: icApp.name,
        getNavigationUrl: () => icApp.route,
      });
    }
  };

  const closeModal = () => {
    // emit HideSidebar event to trigger corresponding action in associated widgets
    uiEvents.next({
      event: EventTypes.HideSidebar,
    });
  };

  return (
    <AppSidebar
      worldAppsTitleLabel={t('World Apps')}
      poweredByLabel="Powered by AKASHA"
      userInstalledAppsTitleLabel={t('Apps')}
      userInstalledApps={[]}
      exploreButtonLabel={t('Explore')}
      allMenuItems={[]}
      worldApps={filteredWorldApps}
      currentRoute={currentLocation.pathname}
      size={size}
      isLoggedIn={!!loginQuery.data.ethAddress}
      loadingUserInstalledApps={false}
      sidebarVisible={sidebarVisible}
      modalSlotId={props.layoutConfig.modalSlotId}
      closeModal={closeModal}
      onClickMenuItem={handleNavigation}
      onClickExplore={handleClickExplore}
    />
  );
};

export default SidebarComponent;
