import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { EventTypes, UIEventData } from '@akashaorg/typings/lib/ui';
import { I18nextProvider, useTranslation } from 'react-i18next';
import {
  filterEvents,
  usePlaformHealthCheck,
  useRootComponentProps,
  useTheme,
} from '@akashaorg/ui-awf-hooks';
import {
  startMobileSidebarHidingBreakpoint,
  startWidgetsTogglingBreakpoint,
} from '@akashaorg/design-system-core/lib/utils/breakpoints';
import { useScrollbarWidth } from 'react-use/lib/useScrollbarWidth';
import { useClickAway } from 'react-use';
import { Extension } from '@akashaorg/ui-lib-extensions/lib/react/extension';
import { Widget } from '@akashaorg/ui-lib-extensions/lib/react/widget';
import { ModalExtension } from '@akashaorg/ui-lib-extensions/lib/react/modal-extension';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ExclamationTriangleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import TopbarLoader from '@akashaorg/design-system-components/lib/components/Loaders/topbar-loader';
import MiniProfileWidgetLoader from '@akashaorg/design-system-components/lib/components/Loaders/mini-profile-widget-loader';
import TrendingWidgetLoader from '@akashaorg/design-system-components/lib/components/Loaders/trending-widget-loader';
import SidebarLoader from '@akashaorg/design-system-components/lib/components/Loaders/sidebar-loader';

const Layout: React.FC<unknown> = () => {
  const [needSidebarToggling, setNeedSidebarToggling] = useState(
    window.matchMedia(startMobileSidebarHidingBreakpoint).matches,
  );
  // sidebar is open by default on larger screens >=1440px
  const [showSidebar, setShowSidebar] = useState(
    !window.matchMedia(startMobileSidebarHidingBreakpoint).matches,
  );

  const scrollBarWidth = useScrollbarWidth();

  const { uiEvents, layoutConfig } = useRootComponentProps();
  // initialise fallback theme, if none is set
  useTheme();

  useEffect(() => {
    const mql = window.matchMedia(startMobileSidebarHidingBreakpoint);

    const resize = () => {
      setShowSidebar(!mql.matches);
    };

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  // widgets are autohidden starting on screens <=768px
  const [showWidgets, setshowWidgets] = useState(
    window.matchMedia(startWidgetsTogglingBreakpoint).matches,
  );

  useLayoutEffect(() => {
    const handleResize = () => {
      setshowWidgets(window.matchMedia(startWidgetsTogglingBreakpoint).matches);
      setNeedSidebarToggling(window.matchMedia(startMobileSidebarHidingBreakpoint).matches);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const maintenanceReq = usePlaformHealthCheck();

  const isPlatformHealthy = useMemo(() => {
    if (!maintenanceReq.isLoading) {
      return maintenanceReq.data.success;
    }
    // defaults to healthy.
    return true;
  }, [maintenanceReq.isLoading, maintenanceReq.data]);

  const _uiEvents = useRef(uiEvents);
  const { t } = useTranslation('ui-widget-layout');

  const handleSidebarShow = () => {
    setShowSidebar(true);
  };

  const handleSidebarHide = () => {
    setShowSidebar(false);
  };

  const handleWidgetsShow = () => {
    setshowWidgets(true);
  };
  const handleWidgetsHide = () => {
    setshowWidgets(false);
  };

  const wrapperRef = useRef(null);

  useClickAway(wrapperRef, () => {
    _uiEvents.current.next({
      event: EventTypes.HideSidebar,
    });
  });

  useEffect(() => {
    const eventsSub = _uiEvents.current
      .pipe(
        filterEvents([
          EventTypes.ShowSidebar,
          EventTypes.HideSidebar,
          EventTypes.ShowSidebar,
          EventTypes.HideWidgets,
        ]),
      )
      .subscribe({
        next: (eventInfo: UIEventData) => {
          switch (eventInfo.event) {
            case EventTypes.ShowSidebar:
              handleSidebarShow();
              break;
            case EventTypes.HideSidebar:
              handleSidebarHide();
              break;
            case EventTypes.ShowWidgets:
              handleWidgetsShow();
              break;
            case EventTypes.HideWidgets:
              handleWidgetsHide();
              break;
            default:
              break;
          }
        },
      });
    return () => {
      if (eventsSub) {
        eventsSub.unsubscribe();
      }
    };
  }, []);

  const layoutStyle = `
      grid min-h-screen
      lg:${showWidgets ? 'grid-cols-[8fr_4fr]' : 'grid-cols-[2fr_8fr_2fr]'}
      ${showSidebar ? 'xl:grid-cols-[3fr_6fr_3fr] ' : 'xl:grid-cols-[1.5fr_6fr_3fr_1.5fr]'}
      xl:max-w-7xl xl:mx-auto gap-x-4
      w-full
      `;

  // the bg(black/30 dark:white/30) is for the overlay background when the sidebar is open on mobile
  const mobileLayoverStyle = `
      fixed xl:sticky h-full ${
        showSidebar && window.matchMedia(startMobileSidebarHidingBreakpoint).matches
          ? 'min-w([100vw] xl:max) bg(black/30 dark:white/10) z-[99] left-0 right-0'
          : ''
      }`;

  const sidebarSlotStyle = `
      fixed top-0 h-screen transition-all duration-300 transform ${
        showSidebar ? 'w-fit translate-x-0' : '-translate-x-full xl:hidden'
      } ${needSidebarToggling ? 'fixed left-0' : ''}
      `;

  // style to prevent horizontal shift when vertical scrollbar appears
  const widthStyle = `w-[calc(100vw-${scrollBarWidth}px)]`;

  return (
    <Stack customStyle={`bg(white dark:black) min-h-screen ${widthStyle}`}>
      <Stack customStyle="h-full m-auto w-[95%] xl:w-full min-h-screen">
        <Stack customStyle={layoutStyle}>
          <Stack customStyle={mobileLayoverStyle}>
            <Stack customStyle={sidebarSlotStyle}>
              {needSidebarToggling ? (
                <Stack padding="pt-0 xl:pt-4" customStyle="h-screen" ref={wrapperRef}>
                  <Widget
                    fullHeight
                    name={layoutConfig.sidebarSlotId}
                    loadingIndicator={<SidebarLoader />}
                  />
                </Stack>
              ) : (
                <Stack padding="pt-0 xl:pt-4" customStyle="h-screen">
                  <Widget
                    fullHeight
                    name={layoutConfig.sidebarSlotId}
                    loadingIndicator={<SidebarLoader />}
                  />
                </Stack>
              )}
            </Stack>
          </Stack>

          <Stack customStyle={`${showWidgets ? '' : 'lg:(col-start-2 col-end-3) col-start-1'}`}>
            <Stack
              padding="pt-4"
              customStyle="sticky top-0 z-10 bg(white dark:black) rounded-b-2xl"
            >
              <Widget name={layoutConfig.topbarSlotId} loadingIndicator={<TopbarLoader />} />
            </Stack>
            <Stack padding="pt-4">
              {!isPlatformHealthy && (
                <Card
                  margin="mb-4"
                  customStyle="bg(warningLight dark:warningDark) border(errorLight dark:errorDark)"
                >
                  <Stack direction="row">
                    <Icon
                      color={{ light: 'grey3', dark: 'grey3' }}
                      icon={<ExclamationTriangleIcon />}
                      customStyle="mr-4"
                    />
                    <Stack>
                      <Text variant="footnotes2" color={{ light: 'grey3', dark: 'grey3' }}>
                        {`${t(
                          'AKASHA is undergoing maintenance and you may experience difficulties accessing some of the apps right now',
                        )}. ${t('Please check back soon')}.`}
                      </Text>
                      <Text variant="footnotes2" color={{ light: 'grey3', dark: 'grey3' }}>{`${t(
                        'Thank you for your patience',
                      )} 😸`}</Text>
                    </Stack>
                  </Stack>
                </Card>
              )}
              <div id={layoutConfig.applicationSlotId} />
              <Stack customStyle="fixed bottom-2">
                <Extension name={layoutConfig.snackbarNotifSlotId} />
              </Stack>
            </Stack>
          </Stack>

          <Stack customStyle="sticky top-0 h-screen">
            <Stack customStyle={`fixed grid grid-auto-rows pt-4 ${showWidgets ? '' : 'hidden'}`}>
              <Widget
                name={layoutConfig.widgetSlotId}
                loadingIndicator={<MiniProfileWidgetLoader />}
              />
              <Widget
                name={layoutConfig.rootWidgetSlotId}
                loadingIndicator={<TrendingWidgetLoader />}
              />
            </Stack>

            <Stack customStyle="fixed bottom-0 mr-4 mb-4">
              <Widget name={layoutConfig.cookieWidgetSlotId} />
            </Stack>
          </Stack>
        </Stack>
        <ModalExtension />
      </Stack>
    </Stack>
  );
};

const LayoutWidget = () => {
  const { getTranslationPlugin } = useRootComponentProps();

  return (
    <I18nextProvider i18n={getTranslationPlugin().i18n}>
      <Layout />
    </I18nextProvider>
  );
};

export default React.memo(LayoutWidget);
