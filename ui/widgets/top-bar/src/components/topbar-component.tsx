import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { EventTypes, UIEventData, RootComponentProps } from '@akashaorg/typings/ui';
import Topbar from './Topbar';

const TopbarComponent: React.FC<RootComponentProps> = props => {
  const { uiEvents } = props;

  const location = useLocation();
  const historyCount = React.useRef(0);
  const isNavigatingBackRef = React.useRef(false);

  const [routeData, setRouteData] = React.useState({});
  // sidebar is open by default on larger screens >=1440px
  const [sidebarVisible, setSidebarVisible] = React.useState<boolean>(
    window.matchMedia('(min-width: 1440px)').matches ? true : false,
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
    const sub = props.plugins['@akashaorg/app-routing']?.routing?.routeObserver?.subscribe({
      next: routeData => {
        setRouteData(routeData?.byArea);
      },
    });

    return () => sub?.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // back navigation functionality

  React.useEffect(function navigationEventListener() {
    const controller = new AbortController();
    const signal = controller.signal;
    window.addEventListener(
      'single-spa:before-routing-event',
      (evt: CustomEvent) => {
        const url = new URL(evt.detail.newUrl as string);
        const newUrl: string = url.origin + url.pathname;

        const url2 = new URL(evt.detail.oldUrl as string);
        const oldUrl: string = url2.origin + url2.pathname;

        if (isNavigatingBackRef.current) {
          isNavigatingBackRef.current = false;
          historyCount.current = historyCount.current - 1;
        } else if (newUrl !== oldUrl) {
          historyCount.current++;
        }
      },
      { signal },
    );
    return () => {
      controller.abort();
    };
  }, []);

  const handleBackClick = () => {
    if (historyCount.current > 0) {
      isNavigatingBackRef.current = true;
      history.back();
    }
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

  const handleSidebarToggle = () => {
    uiEvents.next({
      event: sidebarVisible ? EventTypes.HideSidebar : EventTypes.ShowSidebar,
    });
  };

  const handleAppCenterClick = () => {
    props.plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-integration-center',
      getNavigationUrl: routes => {
        return routes.myProfile;
      },
    });
  };

  const handleNotificationClick = () => {
    props.plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-notifications',
      getNavigationUrl: routes => {
        return routes.myProfile;
      },
    });
  };

  return (
    <Topbar
      sidebarVisible={sidebarVisible}
      onSidebarToggle={handleSidebarToggle}
      onAppCenterClick={handleAppCenterClick}
      onNotificationClick={handleNotificationClick}
      onBackClick={handleBackClick}
      currentLocation={location?.pathname}
      onBrandClick={handleBrandClick}
      modalSlotId={props.layoutConfig.modalSlotId}
    />
  );
};

export default TopbarComponent;
