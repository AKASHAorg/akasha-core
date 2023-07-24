import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { RootComponentProps, EventTypes, UIEventData } from '@akashaorg/typings/ui';
import { I18nextProvider, useTranslation } from 'react-i18next';
import ScrollRestorer from './scroll-restorer';

import { usePlaformHealthCheck, useDismissedCard } from '@akashaorg/ui-awf-hooks';
import {
  startMobileSidebarHidingBreakpoint,
  startWidgetsTogglingBreakpoint,
} from '@akashaorg/design-system-core/lib/utils/breakpoints';
import { useClickAway } from 'react-use';

import Extension from '@akashaorg/design-system-components/lib/components/Extension';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import MessageCard from '@akashaorg/design-system-core/lib/components/MessageCard';

const Layout: React.FC<RootComponentProps> = props => {
  const [activeModal, setActiveModal] = React.useState<UIEventData['data'] | null>(null);
  const [needSidebarToggling, setNeedSidebarToggling] = React.useState(
    window.matchMedia(startMobileSidebarHidingBreakpoint).matches,
  );

  React.useEffect(() => {
    setNeedSidebarToggling(window.matchMedia(startMobileSidebarHidingBreakpoint).matches);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.matchMedia(startMobileSidebarHidingBreakpoint).matches]);

  // sidebar is open by default on larger screens >=1440px
  const [showSidebar, setShowSidebar] = React.useState(
    !window.matchMedia(startMobileSidebarHidingBreakpoint).matches,
  );

  React.useEffect(() => {
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
  const [showWidgets, setshowWidgets] = React.useState(
    window.matchMedia(startWidgetsTogglingBreakpoint).matches,
  );

  const maintenanceReq = usePlaformHealthCheck();

  const dismissedCardId = 'dismiss-the-merge-notification';
  const [dismissed, setDismissed] = useDismissedCard();

  const isPlatformHealthy = React.useMemo(() => {
    if (maintenanceReq.status === 'success') {
      return maintenanceReq.data.success;
    }
    // defaults to healthy.
    return true;
  }, [maintenanceReq.status, maintenanceReq.data]);

  const uiEvents = React.useRef(props.uiEvents);
  const { t } = useTranslation();

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

  const handleModal = React.useCallback(
    (data: UIEventData['data']) => {
      setActiveModal(active => {
        if ((!active || !active.name) && data.name) {
          return data;
        }
        if (!data.name) {
          return null;
        }
        if (activeModal && activeModal.name !== data.name) {
          return data;
        }
        return active;
      });
    },
    [activeModal],
  );

  const wrapperRef = React.useRef(null);

  useClickAway(wrapperRef, () => {
    uiEvents.current.next({
      event: EventTypes.HideSidebar,
    });
  });

  React.useEffect(() => {
    const eventsSub = uiEvents.current.subscribe({
      next: (eventInfo: UIEventData) => {
        switch (eventInfo.event) {
          case EventTypes.ModalRequest:
            handleModal(eventInfo.data);
            break;
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
    uiEvents.current.next({
      event: EventTypes.LayoutReady,
    });
    return () => {
      if (eventsSub) {
        eventsSub.unsubscribe();
      }
    };
  }, [handleModal]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onCloseButtonClick = React.useCallback(() => setDismissed(dismissedCardId), [dismissed]);

  const layoutStyle = `
      grid md:(grid-flow-row) min-h-screen
      lg:${showWidgets ? 'grid-cols-[8fr_4fr]' : 'grid-cols-[2fr_8fr_2fr]'}
      ${showSidebar ? 'xl:grid-cols-[3fr_6fr_3fr] ' : 'xl:grid-cols-[1.5fr_6fr_3fr_1.5fr] '}
      xl:max-w-7xl xl:mx-auto gap-x-4
      `;

  // the bg(black/30 dark:white/30) is for the overlay background when the sidebar is open on mobile
  const mobileLayoverStyle = `
  fixed xl:sticky h-full
      ${
        showSidebar && window.matchMedia(startMobileSidebarHidingBreakpoint).matches
          ? 'min-w-[100vw] xl:min-w-max bg(black/30 dark:white/30) z-[99]'
          : ''
      }
      `;

  const sidebarSlotStyle = `
      sticky top-0 h-screen transition-all duration-300 transform ${
        showSidebar ? 'w-fit translate-x-0' : '-translate-x-full xl:hidden'
      } ${needSidebarToggling ? 'fixed left-0' : ''}
      `;

  return (
    <Box customStyle="bg(white dark:black) min-h-screen">
      <Box
        customStyle="h-full w-11/12 m-auto lg:w-[95%] xl:w-full min-h-screen"
        onKeyDown={() => {
          void 0;
        }}
        role="presentation"
      >
        <Box customStyle={layoutStyle}>
          <ScrollRestorer />
          <Box customStyle={mobileLayoverStyle}>
            <Box customStyle={sidebarSlotStyle}>
              {needSidebarToggling ? (
                <Box customStyle="pt-0 xl:pt-4 h-screen" ref={wrapperRef}>
                  <Extension
                    fullHeight
                    name={props.layoutConfig.sidebarSlotId}
                    uiEvents={props.uiEvents}
                  />
                </Box>
              ) : (
                <Box customStyle="pt-0 xl:pt-4 h-screen">
                  <Extension
                    fullHeight
                    name={props.layoutConfig.sidebarSlotId}
                    uiEvents={props.uiEvents}
                  />
                </Box>
              )}
            </Box>
          </Box>
          <Box customStyle={`${showWidgets ? '' : 'lg:(col-start-2 col-end-3) col-start-1'}`}>
            <Box customStyle="sticky top-0 z-10">
              <Box customStyle="pt-4 bg(white dark:black) rounded-b-2xl">
                <Extension name={props.layoutConfig.topbarSlotId} uiEvents={props.uiEvents} />
              </Box>
            </Box>
            <Box id="scrollTopStop"></Box>
            <Box customStyle="pt-4">
              {!isPlatformHealthy && (
                <BasicCardBox
                  margin="mb-4"
                  customStyle="bg(warningLight dark:warningDark) border(errorLight dark:errorDark)"
                >
                  <Box customStyle="flex flex-row">
                    <Icon
                      color={{ light: 'grey3', dark: 'grey3' }}
                      type="ExclamationTriangleIcon"
                      customStyle="mr-4"
                    />
                    <Box>
                      <Text variant="footnotes2" color={{ light: 'grey3', dark: 'grey3' }}>
                        {`${t(
                          'AKASHA is undergoing maintenance and you may experience difficulties accessing some of the apps right now',
                        )}. ${t('Please check back soon')}.`}
                      </Text>
                      <Text variant="footnotes2" color={{ light: 'grey3', dark: 'grey3' }}>{`${t(
                        'Thank you for your patience',
                      )} 😸`}</Text>
                    </Box>
                  </Box>
                </BasicCardBox>
              )}
              {!dismissed.includes(dismissedCardId) && (
                <MessageCard
                  testId="the-merge-notification"
                  title={t('Goerli Test Network')}
                  titleIconType="ExclamationTriangleIcon"
                  background={{ light: 'warningDark/30', dark: 'warningDark/30' }}
                  borderColor={{ light: 'warningLight', dark: 'warningDark' }}
                  message={`${t(
                    'Following the merge, the Rinkeby network has been deprecated',
                  )}. ${t('We have migrated Akasha World to the Goerli testnet')}. ${t(
                    'This will not affect your content or posts, they are saved',
                  )}! ${t(
                    'But some functionalities such as claiming ENS names won’t be possible',
                  )}. ${t('We are working hard on mitigating any issues')}. ${t(
                    'Bear with us',
                  )} 🙏🏽.`}
                  customStyle="mb-4"
                  onClose={onCloseButtonClick}
                />
              )}
              <Extension name={props.layoutConfig.pluginSlotId} uiEvents={props.uiEvents} />
            </Box>
          </Box>
          <Box customStyle="sticky top-0">
            <Box customStyle={`grid grid-auto-rows pt-4 ${showWidgets ? '' : 'hidden'}`}>
              <Extension name={props.layoutConfig.widgetSlotId} uiEvents={props.uiEvents} />
              <Extension name={props.layoutConfig.rootWidgetSlotId} uiEvents={props.uiEvents} />
            </Box>
            <Box customStyle="fixed bottom-0 mr-4 mb-4">
              <Extension name={props.layoutConfig.cookieWidgetSlotId} uiEvents={props.uiEvents} />
            </Box>
          </Box>
        </Box>
        {activeModal && (
          <Extension
            name={activeModal.name}
            uiEvents={props.uiEvents}
            customStyle="relative z-999"
          />
        )}
        <Extension
          name={props.layoutConfig.modalSlotId}
          uiEvents={props.uiEvents}
          customStyle="relative z-999"
        />
      </Box>
    </Box>
  );
};

const LayoutWidget: React.FC<RootComponentProps> = props => (
  <Router>
    <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
      <Layout {...props} />
    </I18nextProvider>
  </Router>
);

export default React.memo(LayoutWidget);
