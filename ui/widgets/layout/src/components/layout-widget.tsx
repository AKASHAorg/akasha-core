import React from 'react';
import { isMobileOnly } from 'react-device-detect';
import { BrowserRouter as Router, useMatch } from 'react-router-dom';

import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { EventTypes, ItemTypes, UIEventData } from '@akashaproject/ui-awf-typings/lib/app-loader';

import { GlobalStyle } from './global-style';
import ScrollRestorer from './scroll-restorer';
import {
  MainAreaContainer,
  ScrollableWidgetArea,
  SidebarAreaContainer,
  SidebarWrapper,
  WidgetAreaContainer,
  WidgetContainer,
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

const { Box } = DS;

const Layout: React.FC<RootComponentProps> = props => {
  const [activeModal, setActiveModal] = React.useState<UIEventData['data'] | null>(null);
  // sidebar is open by default on larger screens
  const [showSidebar, setShowSidebar] = React.useState(!isMobileOnly ? true : false);

  const isMatchingFocusedMode = useMatch('/auth-app/*');
  const isFocusedMode = !!isMatchingFocusedMode;

  const uiEvents = React.useRef(props.uiEvents);

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
      event: EventTypes.ModalMount,
      data: activeModal,
    });
  }, [activeModal]);

  const handleModalNodeUnmount = (name: string) => {
    uiEvents.current.next({
      event: EventTypes.ModalUnmount,
      data: { name },
    });
  };

  const handleSidebarShow = () => {
    setShowSidebar(true);
  };
  const handleSidebarHide = () => {
    setShowSidebar(false);
  };

  React.useEffect(() => {
    const eventsSub = uiEvents.current.subscribe({
      next: (eventInfo: UIEventData) => {
        if (eventInfo.event === EventTypes.ModalMountRequest && eventInfo.data) {
          if (typeof eventInfo.data.entryType === 'string') {
            eventInfo.data.entryType = parseInt(eventInfo.data.entryType, 10) || ItemTypes.ENTRY;
          }
          setActiveModal(eventInfo.data);
        }
        if (eventInfo.event === EventTypes.ModalUnmountRequest && eventInfo.data?.name) {
          setActiveModal(null);
        }
        if (eventInfo.event === EventTypes.ShowSidebar) {
          handleSidebarShow();
        }
        if (eventInfo.event === EventTypes.HideSidebar) {
          handleSidebarHide();
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
  }, []);

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
                {isFocusedMode && (
                  <FocusedPluginSlot
                    name={props.layoutConfig.focusedPluginSlotId}
                    onMount={handleExtensionMount}
                    onUnmount={handleExtensionUnmount}
                  />
                )}
                {!isFocusedMode && (
                  <PluginSlot
                    name={props.layoutConfig.pluginSlotId}
                    onMount={handleExtensionMount}
                    onUnmount={handleExtensionUnmount}
                  />
                )}
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
    <Layout {...props} />
  </Router>
);

export default React.memo(LayoutWidget);
