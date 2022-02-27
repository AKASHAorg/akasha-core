import DS from '@akashaproject/design-system';
import React from 'react';
import { GlobalStyle } from './global-style';
import {
  MainAreaContainer,
  ScrollableWidgetArea,
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
import { EventTypes, ItemTypes, UIEventData } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import ScrollRestorer from './scroll-restorer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const { Box } = DS;

const LayoutWidget: React.FC<RootComponentProps> = props => {
  const [activeModal, setActiveModal] = React.useState<UIEventData['data'] | null>(null);
  const [showSidebar, setShowSidebar] = React.useState(false);

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
          if (activeModal && activeModal.name !== eventInfo.data.name) {
            handleModalNodeUnmount(activeModal.name);
          }
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
    return () => {
      if (eventsSub) {
        eventsSub.unsubscribe();
      }
    };
  }, [activeModal]);

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
            <Router>
              <Routes>
                <Route
                  path="/auth-app/*"
                  element={
                    <MainAreaContainer sidebarVisible={false}>
                      <FocusedPluginSlot
                        name={props.layoutConfig.focusedPluginSlotId}
                        onMount={handleExtensionMount}
                        onUnmount={handleExtensionUnmount}
                      />
                    </MainAreaContainer>
                  }
                />
                <Route
                  path="*"
                  element={
                    <>
                      <SidebarWrapper visible={showSidebar}>
                        <SidebarSlot
                          name={props.layoutConfig.sidebarSlotId}
                          onMount={handleExtensionMount}
                          onUnmount={handleExtensionUnmount}
                        />
                      </SidebarWrapper>
                      <MainAreaContainer sidebarVisible={showSidebar}>
                        <Box direction="row">
                          <PluginSlot
                            name={props.layoutConfig.pluginSlotId}
                            onMount={handleExtensionMount}
                            onUnmount={handleExtensionUnmount}
                          />
                          <WidgetContainer>
                            {/* ^ sticky container for widgets */}
                            <WidgetAreaContainer>
                              <ScrollableWidgetArea>
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
                    </>
                  }
                />
              </Routes>
            </Router>
          </Box>
          {activeModal && (
            <ModalSlot
              key={activeModal.name}
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

export default React.memo(LayoutWidget);
