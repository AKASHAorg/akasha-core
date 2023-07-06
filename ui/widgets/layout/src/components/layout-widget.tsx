import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { RootComponentProps, EventTypes, UIEventData } from '@akashaorg/typings/ui';
import { I18nextProvider, useTranslation } from 'react-i18next';
import ScrollRestorer from './scroll-restorer';
import { apply, tw } from '@twind/core';

import { usePlaformHealthCheck, useDismissedCard } from '@akashaorg/ui-awf-hooks';
import Extension from '@akashaorg/design-system-components/lib/components/Extension';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import MessageCard from '@akashaorg/design-system-core/lib/components/MessageCard';

const Layout: React.FC<RootComponentProps> = props => {
  const [activeModal, setActiveModal] = React.useState<UIEventData['data'] | null>(null);
  const sidebarWrapperRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  // sidebar is open by default on larger screens >=1440px
  const [showSidebar, setShowSidebar] = React.useState(
    window.matchMedia('(min-width: 1440px)').matches ? true : false,
  );
  const [showWidgets, setshowWidgets] = React.useState(
    window.matchMedia('(min-width: 769px)').matches ? true : false,
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

  const handleClickOutside = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.matchMedia('(max-width: 1439px)').matches &&
      showSidebar &&
      sidebarWrapperRef.current &&
      !sidebarWrapperRef.current.contains(e.target as Node)
    ) {
      uiEvents.current.next({
        event: EventTypes.HideSidebar,
      });
    }
  };

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

  const layoutStyle = apply`
      grid md:(grid-flow-row) min-h-screen
      lg:${showWidgets ? 'grid-cols-[8fr_4fr]' : 'grid-cols-[2fr_8fr_2fr]'}
      ${showSidebar ? 'xl:grid-cols-[3fr_6fr_3fr] ' : 'xl:grid-cols-[1.5fr_6fr_3fr_1.5fr] '}
      xl:max-w-7xl xl:mx-auto gap-x-4
      `;
  const mobileLayoverStyle = apply`
      fixed xl:sticky z-[9999] h-full
      ${
        showSidebar && !window.matchMedia('(min-width: 1440px)').matches
          ? 'min-w-[100vw] xl:min-w-max'
          : ''
      }
      `;
  const sidebarSlotStyle = apply`
      sticky top-0 h-screen w-fit ${showSidebar ? '' : 'hidden'}
      `;

  return (
    <div className={tw('bg(white dark:black) min-h-screen')}>
      <div
        className={tw('h-full w-11/12 m-auto lg:w-full min-h-screen')}
        onClick={handleClickOutside}
        onKeyDown={() => {
          void 0;
        }}
        role="presentation"
      >
        <div className={tw(layoutStyle)}>
          <ScrollRestorer />
          <div className={tw(mobileLayoverStyle)}>
            <div className={tw(sidebarSlotStyle)}>
              <div className={tw('pt-0 xl:pt-4 h-screen')} ref={sidebarWrapperRef}>
                <Extension
                  fullHeight
                  name={props.layoutConfig.sidebarSlotId}
                  uiEvents={props.uiEvents}
                />
              </div>
            </div>
          </div>
          <div
            className={tw(apply(`${showWidgets ? '' : 'lg:(col-start-2 col-end-3) col-start-1'}`))}
          >
            <div className={tw('sticky top-0 z-50')}>
              <div className={tw('pt-4 bg(white dark:black) rounded-b-2xl')}>
                <Extension name={props.layoutConfig.topbarSlotId} uiEvents={props.uiEvents} />
              </div>
            </div>
            <div id="scrollTopStop"></div>
            <div className={tw('pt-4')}>
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
            </div>
          </div>
          <div className={tw('sticky top-0 h-screen')}>
            <div className={tw(`${showWidgets ? '' : 'hidden'} grid grid-auto-rows pt-4`)}>
              <Extension name={props.layoutConfig.widgetSlotId} uiEvents={props.uiEvents} />
              <Extension name={props.layoutConfig.rootWidgetSlotId} uiEvents={props.uiEvents} />
            </div>
            <div className={tw('fixed bottom-0 mr-4 mb-4')}>
              <Extension name={props.layoutConfig.cookieWidgetSlotId} uiEvents={props.uiEvents} />
            </div>
          </div>
        </div>
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
      </div>
    </div>
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
