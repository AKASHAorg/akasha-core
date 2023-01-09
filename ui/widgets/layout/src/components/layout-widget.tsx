import React from 'react';
import { BrowserRouter as Router, useMatch } from 'react-router-dom';
import DS from '@akashaorg/design-system';
import { RootComponentProps, EventTypes, UIEventData } from '@akashaorg/typings/ui';
import { I18nextProvider, useTranslation } from 'react-i18next';
import ScrollRestorer from './scroll-restorer';
import { tw } from '@twind/core';
import { Container } from '@akashaorg/design-system-core/lib/components/Container';

import { FocusedPluginSlot } from './styled-slots';

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
  // sidebar is open by default on larger screens >=1440px
  const [showSidebar, setShowSidebar] = React.useState(
    window.matchMedia('(min-width: 1440px)').matches ? true : false,
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

  const isMatchingFocusedMode = useMatch('/@akashaorg/app-auth-ewa/*');
  const isFocusedMode = !!isMatchingFocusedMode;

  const uiEvents = React.useRef(props.uiEvents);
  const { t } = useTranslation();
  const handleExtensionMount = (name: string) => {
    props.uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: {
        name,
      },
    });
  };

  const handleExtensionUnmount = (name: string) => {
    uiEvents.current.next({
      event: EventTypes.ExtensionPointUnmount,
      data: {
        name,
      },
    });
  };

  const handleSidebarShow = () => {
    setShowSidebar(true);
  };
  const handleSidebarHide = () => {
    setShowSidebar(false);
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

  const onCloseButtonClick = React.useCallback(() => setDismissed(dismissedCardId), [dismissed]);

  return (
    <div className="bg-background dark:(bg-background-dark)">
      <div className="grid sm:grid-cols-[8fr_4fr] md:grid-cols-[3fr_6fr_3fr] gap-6 max-w-7xl mx-auto">
        <ScrollRestorer />
        <div>
          <div className="sticky top-2">
            <Extension name={props.layoutConfig.sidebarSlotId} uiEvents={props.uiEvents} />
          </div>
        </div>
        <div>
          <div className="sticky top-2">
            <Extension name={props.layoutConfig.topbarSlotId} uiEvents={props.uiEvents} />
          </div>

          <div id="scrollTopStop"></div>
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
          <FocusedPluginSlot
            name={props.layoutConfig.focusedPluginSlotId}
            onMount={handleExtensionMount}
            onUnmount={handleExtensionUnmount}
            style={!isFocusedMode ? { display: 'none' } : {}}
          />
          <Extension name={props.layoutConfig.pluginSlotId} uiEvents={props.uiEvents} />
        </div>
        <div>
          <div className="sticky top-2">
            <Extension name={props.layoutConfig.widgetSlotId} uiEvents={props.uiEvents} />
            <Extension name={props.layoutConfig.rootWidgetSlotId} uiEvents={props.uiEvents} />
          </div>
          <Container fixedBottom maxWXL rightMd>
            <Extension name={props.layoutConfig.cookieWidgetSlotId} uiEvents={props.uiEvents} />
          </Container>
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
