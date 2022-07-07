import React from 'react';
import { BrowserRouter as Router, useMatch } from 'react-router-dom';
import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import { EventTypes, UIEventData } from '@akashaorg/ui-awf-typings/lib/app-loader';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { GlobalStyle } from './global-style';
import ScrollRestorer from './scroll-restorer';
import {
  MainAreaContainer,
  ScrollableWidgetArea,
  SidebarAreaContainer,
  SidebarWrapper,
  WidgetAreaContainer,
  WidgetContainer,
  PluginContainer,
} from './styled-containers';
import {
  ModalSlot,
  PluginSlot,
  TopbarSlot,
  SidebarSlot,
  WidgetSlot,
  FocusedPluginSlot,
  CookieWidgetSlot,
} from './styled-slots';
import { usePlaformHealthCheck } from '@akashaorg/ui-awf-hooks';

const { Box, BasicCardBox, Icon, styled, Text } = DS;

const WarningCard = styled(BasicCardBox)`
  background-color: ${props => props.theme.colors.warning};
  color: ${props => props.theme.colors.secondary};
  user-select: none;
  border-width: 1px;
  border-color: ${props => props.theme.colors.warningBorder};
  border-style: solid;
  display: inline-flex;
  align-items: start;
  width: 100vw;
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

  /**
   * Handler for modal mount events
   * This event is only triggered when `navigateToModal` fn is called
   */
  const handleModalNodeMount = React.useCallback(() => {
    uiEvents.current.next({
      event: EventTypes.ExtensionPointMount,
      data: activeModal,
    });
  }, [activeModal]);

  const handleModalNodeUnmount = (name: string) => {
    if (!name) {
      return;
    }
    uiEvents.current.next({
      event: EventTypes.ExtensionPointUnmount,
      data: { name },
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

  return (
    <>
      <ScrollRestorer />
      <div>
        <GlobalStyle />
        <div>
          {/* ^ topbar sticky container */}
          <TopbarSlot
            name={props.layoutConfig.topbarSlotId}
            onMount={handleExtensionMount}
            onUnmount={handleExtensionUnmount}
          />
          <Box direction="row" flex={true}>
            <SidebarWrapper>
              <SidebarAreaContainer>
                {/* container enforces sticky position on scroll */}
                <SidebarSlot
                  visible={isFocusedMode ? false : showSidebar}
                  name={props.layoutConfig.sidebarSlotId}
                  onMount={handleExtensionMount}
                  onUnmount={handleExtensionUnmount}
                />
              </SidebarAreaContainer>
            </SidebarWrapper>
            <MainAreaContainer sidebarVisible={isFocusedMode ? false : showSidebar}>
              <Box direction="row">
                <PluginContainer>
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
                  <FocusedPluginSlot
                    name={props.layoutConfig.focusedPluginSlotId}
                    onMount={handleExtensionMount}
                    onUnmount={handleExtensionUnmount}
                    style={!isFocusedMode ? { display: 'none' } : {}}
                  />
                  <PluginSlot
                    name={props.layoutConfig.pluginSlotId}
                    onMount={handleExtensionMount}
                    onUnmount={handleExtensionUnmount}
                    style={isFocusedMode ? { display: 'none' } : {}}
                  />
                </PluginContainer>
                <WidgetContainer>
                  {/* ^ sticky container for widgets */}
                  <WidgetAreaContainer>
                    <ScrollableWidgetArea style={isFocusedMode ? { display: 'none' } : {}}>
                      <WidgetSlot
                        name={props.layoutConfig.widgetSlotId}
                        onMount={handleExtensionMount}
                        onUnmount={handleExtensionUnmount}
                      />
                      <WidgetSlot
                        name={props.layoutConfig.rootWidgetSlotId}
                        onMount={handleExtensionMount}
                        onUnmount={handleExtensionUnmount}
                      />
                    </ScrollableWidgetArea>
                    <CookieWidgetSlot
                      name={props.layoutConfig.cookieWidgetSlotId}
                      onMount={handleExtensionMount}
                      onUnmount={handleExtensionUnmount}
                    />
                  </WidgetAreaContainer>
                </WidgetContainer>
              </Box>
            </MainAreaContainer>
          </Box>
          {activeModal && (
            <ModalSlot
              name={activeModal.name}
              onMount={handleModalNodeMount}
              onUnmount={handleModalNodeUnmount}
              style={{ position: 'relative', zIndex: 200 }}
            />
          )}
          <ModalSlot
            name={props.layoutConfig.modalSlotId}
            onMount={handleExtensionMount}
            onUnmount={handleExtensionUnmount}
            style={{ position: 'relative', zIndex: 200 }}
          />
        </div>
      </div>
    </>
  );
};

const LayoutWidget: React.FC<RootComponentProps> = props => (
  <Router>
    <I18nextProvider i18n={props.plugins?.translation?.i18n}>
      <Layout {...props} />
    </I18nextProvider>
  </Router>
);

export default React.memo(LayoutWidget);
