import React from 'react';
import { BrowserRouter as Router, useMatch } from 'react-router-dom';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import { EventTypes, ItemTypes, UIEventData } from '@akashaorg/ui-awf-typings/lib/app-loader';

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
  // sidebar is open by default on larger screens >=1440px
  const [showSidebar, setShowSidebar] = React.useState(
    window.matchMedia('(min-width: 1440px)').matches ? true : false,
  );

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
  const handleModal = (data: UIEventData['data']) => {
    setActiveModal(active => {
      if (!active) {
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
