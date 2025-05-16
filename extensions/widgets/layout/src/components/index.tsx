import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { EventTypes, UIEventData } from '@akashaorg/typings/lib/ui';
import { I18nextProvider, useTranslation } from 'react-i18next';
import {
  filterEvents,
  usePlaformHealthCheck,
  useRootComponentProps,
  useTheme,
  withProviders,
} from '@akashaorg/ui-core-hooks';
import {
  startMobileSidebarHidingBreakpoint,
  startWidgetsTogglingBreakpoint,
} from '@akashaorg/design-system-core/lib/utils/breakpoints';
import { Extension } from '@akashaorg/ui-lib-extensions/lib/react/extension';
import { Widget } from '@akashaorg/ui-lib-extensions/lib/react/widget';
import { ModalExtension } from '@akashaorg/ui-lib-extensions/lib/react/modal-extension';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { TriangleAlertIcon, CircleAlertIcon } from 'lucide-react';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import TopbarLoader from '@akashaorg/design-system-components/lib/components/Loaders/topbar-loader';
import MiniProfileWidgetLoader from '@akashaorg/design-system-components/lib/components/Loaders/mini-profile-widget-loader';
import TrendingWidgetLoader from '@akashaorg/design-system-components/lib/components/Loaders/trending-widget-loader';
import SidebarLoader from '@akashaorg/design-system-components/lib/components/Loaders/sidebar-loader';
import { cssVars } from '@akashaorg/ui/lib/library/to-css-var';
import { useSticky } from './use-sticky';
const sidebarLoadingIndicator = <SidebarLoader />;
const miniProfileLoadingIndicator = <MiniProfileWidgetLoader />;
const trendingWidgetLoadingIndicator = <TrendingWidgetLoader />;
const topbarLoadingIndicator = <TopbarLoader />;
const Layout: React.FC<unknown> = () => {
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const widgetContentRef = useRef<HTMLDivElement>(null);
  const [needSidebarToggling, setNeedSidebarToggling] = useState(
    window.matchMedia(startMobileSidebarHidingBreakpoint).matches,
  );
  // sidebar is open by default on larger screens >=1440px
  const [showSidebar, setShowSidebar] = useState(
    !window.matchMedia(startMobileSidebarHidingBreakpoint).matches,
  );
  const { uiEvents, layoutSlots, worldConfig } = useRootComponentProps();
  // initialise fallback theme, if none is set
  useTheme();
  const [position, stickyPos, contentHeight, offset] = useSticky(
    widgetContainerRef,
    widgetContentRef,
    8,
  );
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
  const handleWidgetsShow = React.useCallback(() => {
    if (showWidgets) return;
    setshowWidgets(true);
  }, [showWidgets]);
  const handleWidgetsHide = () => {
    setshowWidgets(false);
  };
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
  }, [handleWidgetsShow]);
  const handleExitPreview = () => {
    if (sessionStorage.getItem('previewWorldId')) {
      sessionStorage.removeItem('previewWorldId');
      window.location.reload();
    }
  };
  const layoutStyle = `grid min-h-full lg:${showWidgets ? 'grid-cols-[8fr_4fr]' : 'grid-cols-[2fr_8fr_2fr]'} ${showSidebar ? 'xl:grid-cols-[3fr_6fr_3fr] ' : 'xl:grid-cols-[1.5fr_6fr_3fr_1.5fr]'} xl:max-w-7xl xl:mx-auto gap-x-3 w-full`;

  const sidebarSlotStyle = `
      fixed top-4 h-screen transition-all duration-200 transform z-[99] ${
        showSidebar && 'w-fit translate-x-0'
      } ${needSidebarToggling ? 'fixed left-0' : ''}
      `;
  return (
    <Stack
      style={{
        ...cssVars({
          '--content-height': `${contentHeight}px`,
          '--offset': `${offset}px`,
        }),
        /** since the 100vw is including the scrollbar and
         * 100% is the width excluding the scrollbar
         * we can add a left padding (when the scrollbar is visible)
         * to readjust the middle of the page, thus compensating the presence
         * of the scrollbar
         */
        paddingLeft: 'calc(100vw - 100%)',
      }}
      className="bg-white dark:bg-black min-h-screen"
    >
      <Stack className="h-full m-auto w-full min-h-screen">
        <Stack className={layoutStyle}>
          <Stack>
            <Stack className={sidebarSlotStyle}>
              <Widget
                fullHeight
                name={layoutSlots.sidebarSlotId}
                loadingIndicator={sidebarLoadingIndicator}
              />
            </Stack>
          </Stack>
          <Stack className={`px-2 ${showWidgets ? '' : 'lg:col-start-2 lg:col-end-3 col-start-1'}`}>
            <Stack className="pt-4 sticky top-0 z-10 bg-white dark:bg-black rounded-b-3xl">
              {worldConfig.isPreview && (
                <Card className="p-4 mb-4">
                  <Stack direction="row">
                    <CircleAlertIcon className="h-5 w-5 mr-4 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
                    <Typography variant="sm" className="font-light">
                      {t('You are previewing "{{worldName}}"', {
                        worldName: worldConfig.title,
                      })}
                      .
                    </Typography>
                  </Stack>
                  <Button variant="link" onClick={handleExitPreview}>
                    {t('Leave Preview')}
                  </Button>
                </Card>
              )}
              <Widget name={layoutSlots.topbarSlotId} loadingIndicator={topbarLoadingIndicator} />
            </Stack>
            <Stack spacing={4} className="pt-4">
              {!isPlatformHealthy && (
                <Card className="mb-4 border-warning-foreground background-warning">
                  <Stack direction="row">
                    <TriangleAlertIcon className="h-5 w-5 mr-4 [&>*]:stroke-grey3 dark:[&>*]:stroke-grey3" />
                    <Stack>
                      <Typography variant="xs" className="font-medium text-grey3 dark:text-grey3">
                        {`${t('AKASHA is undergoing maintenance and you may experience difficulties accessing some of the apps right now')}. ${t('Please check back soon')}.`}
                      </Typography>
                      <Typography
                        variant="xs"
                        className="font-medium text-grey3 dark:text-grey3"
                      >{`${t('Thank you for your patience')} 😸`}</Typography>
                    </Stack>
                  </Stack>
                </Card>
              )}
              <div id={layoutSlots.applicationSlotId} />
              <Stack className="sticky bottom-2">
                <Extension name={layoutSlots.snackbarNotifSlotId} />
              </Stack>
            </Stack>
          </Stack>

          <Stack
            ref={widgetContainerRef}
            style={cssVars({
              '--content-height': `${contentHeight}px`,
            })}
            className={`pr-2 relative min-h-[var(--content-height)] h-full`}
          >
            <Stack className="h-full hidden lg:flex">
              <Stack
                style={cssVars({
                  '--offset': `${offset}px`,
                })}
                className={`mt-[var(--offset)]`}
              />
              <Stack
                ref={widgetContentRef}
                style={stickyPos.cssVar}
                className={`${position} ${stickyPos.className} ${showWidgets ? '' : 'hidden'} self-start`}
              >
                <Stack className="my-4">
                  <Widget
                    name={layoutSlots.contextualWidgetSlotId}
                    loadingIndicator={miniProfileLoadingIndicator}
                  />
                  <Widget
                    name={layoutSlots.widgetSlotId}
                    loadingIndicator={trendingWidgetLoadingIndicator}
                  />
                </Stack>
              </Stack>
            </Stack>
            <Stack className="fixed bottom-2 lg:w-[21.125rem]">
              <Widget name={layoutSlots.cookieWidgetSlotId} />
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
export default withProviders(LayoutWidget);
