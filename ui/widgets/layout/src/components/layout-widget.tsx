import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import DS from '@akashaorg/design-system';
import { RootComponentProps, EventTypes, UIEventData } from '@akashaorg/typings/ui';
import { I18nextProvider, useTranslation } from 'react-i18next';
import ScrollRestorer from './scroll-restorer';
import { isMobileOnly } from 'react-device-detect';

import { usePlaformHealthCheck, useDismissedCard } from '@akashaorg/ui-awf-hooks';

const { Box, BasicCardBox, Icon, styled, Text, Extension } = DS;

const WarningCard = styled(BasicCardBox)`
  background-color: ${props => props.theme.colors.warning};
  color: ${props => props.theme.colors.secondary};
  user-select: none;
  border-width: 1px;
  border-color: ${props => props.theme.colors.warningBorder};
  border-style: solid;
  display: inline-flex;
  align-items: start;
`;

const WarningIcon = styled(Icon)`
  margin-right: 0.5rem;
  margin-top: 0.2rem;
`;

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

  const isPlatformHealty = React.useMemo(() => {
    if (maintenanceReq.status === 'success') {
      return maintenanceReq.data.success;
    }
    // defaults to healty.
    return true;
  }, [maintenanceReq.status, maintenanceReq.data]);

  const uiEvents = React.useRef(props.uiEvents);
  const { t } = useTranslation();

  const handleSidebarShow = () => {
    setShowSidebar(true);
    console.log(showSidebar);
  };
  const handleSidebarHide = () => {
    setShowSidebar(false);
    console.log(showSidebar);
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
  React.useEffect(() => {
    function handleClickOutside(e) {
      if (window.matchMedia('(min-width: 1440px)').matches) {
        return;
      }
      if (!showSidebar) {
        return;
      }
      e.stopPropagation();
      if (sidebarWrapperRef.current && !sidebarWrapperRef.current.contains(e.target)) {
        console.log('clicked outside');
        uiEvents.current.next({
          event: EventTypes.HideSidebar,
        });
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarWrapperRef]);

  React.useEffect(() => {
    console.log('showSidebar inside layout-widget: ', showSidebar);
  }, [showSidebar]);
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

  return (
    <div className="bg-background dark:(bg-background-dark) min-h-screen">
      <div className={`h-full w-full`}>
        <div
          className={`grid md:(grid-flow-row) lg:${
            showWidgets ? 'grid-cols-[8fr_4fr]' : 'grid-cols-[2fr_8fr_2fr]'
          } ${
            showSidebar ? 'xl:grid-cols-[3fr_6fr_3fr] ' : 'xl:grid-cols-[1.5fr_6fr_3fr_1.5fr] '
          } xl:max-w-7xl xl:mx-auto gap-x-4`}
        >
          <ScrollRestorer />
          <div
            className={`fixed xl:sticky z-[9999] h-full 
           ${
             showSidebar && !window.matchMedia('(min-width: 1440px)').matches
               ? 'min-w-[100vw] xl:min-w-max bg-black/20'
               : ''
           }`}
          >
            <div
              className={`sticky top-0 h-screen w-fit ${showSidebar ? '' : 'hidden'}
`}
            >
              <div className={`pt-0 xl:pt-4`} ref={sidebarWrapperRef}>
                <Extension
                  fullHeight
                  name={props.layoutConfig.sidebarSlotId}
                  uiEvents={props.uiEvents}
                />
              </div>
            </div>
          </div>
          <div className={`${showWidgets ? '' : 'col-start-2 col-end-3 md:col-start-1'}`}>
            <div className="sticky top-0 z-50">
              <div className="text() pt-4 bg-background dark:(bg-background-dark)">
                <Extension name={props.layoutConfig.topbarSlotId} uiEvents={props.uiEvents} />
              </div>
            </div>
            <div id="scrollTopStop"></div>
            <div className="pt-4">
              {!isPlatformHealty && (
                <WarningCard margin={{ bottom: 'small' }} pad="small" direction="row">
                  <WarningIcon type="error" themeColor="secondary" />
                  <Box width="100%">
                    <Text size="medium">
                      {`${t(
                        'AKASHA is undergoing maintenance and you may experience difficulties accessing some of the apps right now',
                      )}. ${t('Please check back soon')}.`}
                    </Text>
                    <Text size="medium">{`${t('Thank you for your patience')} 😸`}</Text>
                  </Box>
                </WarningCard>
              )}
              {!dismissed.includes(dismissedCardId) && (
                <WarningCard
                  margin={{ bottom: 'small' }}
                  pad="small"
                  direction="row"
                  key={dismissedCardId}
                  data-testid="the-merge-notification"
                >
                  <WarningIcon type="error" themeColor="secondary" />
                  <Box width="100%">
                    <Text size="medium">
                      {`${t('Following the merge, the Rinkeby network has been deprecated')}. ${t(
                        'We have migrated Ethereum World to the Goerli testnet',
                      )}. ${t('This will not affect your content or posts, they are saved')}! ${t(
                        'But some functionalities such as claiming ENS names won’t be possible',
                      )}. ${t('We are working hard on mitigating any issues')}. ${t(
                        'Bear with us 🙏🏽',
                      )}.`}
                    </Text>
                  </Box>
                  <Icon
                    type="close"
                    clickable={true}
                    onClick={onCloseButtonClick}
                    size="xs"
                    accentColor={true}
                    data-testid="the-merge-notification-close-button"
                  />
                </WarningCard>
              )}
              <Extension name="back-navigation" uiEvents={props.uiEvents} />
              <Extension name={props.layoutConfig.pluginSlotId} uiEvents={props.uiEvents} />
            </div>
          </div>
          <div>
            <div className="sticky top-0">
              <div className={`${showWidgets ? '' : 'hidden'} grid grid-auto-rows pt-4`}>
                <Extension name={props.layoutConfig.widgetSlotId} uiEvents={props.uiEvents} />
                <Extension name={props.layoutConfig.rootWidgetSlotId} uiEvents={props.uiEvents} />
              </div>
              <div className="fixed right-0 bottom-0">
                <Extension name={props.layoutConfig.cookieWidgetSlotId} uiEvents={props.uiEvents} />
              </div>
            </div>
          </div>
        </div>
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
