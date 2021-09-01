import DS from '@akashaproject/design-system';
import React from 'react';
import { GlobalStyle } from './global-style';
import {
  MainAreaContainer,
  ScrollableWidgetArea,
  SidebarWrapper,
  WidgetContainer,
} from './styled-containers';
import { ModalSlot, PluginSlot, TopbarSlot, SidebarSlot, WidgetSlot } from './styled-slots';
import CookieWidget from './cookie-widget';
import { EventTypes, UIEventData } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import i18next from '../i18n';
import { I18nextProvider } from 'react-i18next';

const {
  Box,
  lightTheme,
  // darkTheme,
  ThemeSelector,
  responsiveBreakpoints,
  ViewportSizeProvider,
  // useViewportSize,
} = DS;

const LayoutWidget: React.FC<RootComponentProps> = props => {
  const [activeModal, setActiveModal] = React.useState<UIEventData['data'] | null>(null);
  const [showSidebar, setShowSidebar] = React.useState(false);

  const handleExtensionMount = (name: string) => {
    props.uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: {
        name,
      },
    });
  };

  const handleExtensionUnmount = React.useCallback(
    (name: string) => {
      props.uiEvents.next({
        event: EventTypes.ExtensionPointUnmount,
        data: {
          name,
        },
      });
    },
    [props.uiEvents],
  );

  /**
   * Handler for modal mount events
   * This event is only triggered when `navigateToModal` fn is called
   */
  const handleModalNodeMount = React.useCallback(() => {
    props.uiEvents.next({
      event: EventTypes.ModalMount,
      data: activeModal,
    });
  }, [activeModal, props.uiEvents]);

  const handleModalNodeUnmount = React.useCallback(
    (name: string) => {
      props.uiEvents.next({
        event: EventTypes.ModalUnmount,
        data: { name },
      });
    },
    [props.uiEvents],
  );

  const handleSidebarShow = () => {
    setShowSidebar(true);
  };
  const handleSidebarHide = () => {
    setShowSidebar(false);
  };
  React.useEffect(() => {
    const eventsSub = props.uiEvents.subscribe({
      next: (eventInfo: UIEventData) => {
        if (eventInfo.event === EventTypes.ModalMountRequest && eventInfo.data) {
          if (activeModal && activeModal.name !== eventInfo.data.name) {
            handleModalNodeUnmount(activeModal.name);
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
  }, [activeModal, props.uiEvents, handleModalNodeUnmount]);

  return (
    <I18nextProvider i18n={i18next}>
      <Box className="container" fill="horizontal">
        <GlobalStyle theme={{ breakpoints: responsiveBreakpoints.global.breakpoints }} />
        <Box className="container">
          <ThemeSelector
            availableThemes={[lightTheme]}
            settings={{ activeTheme: 'Light-Theme' }}
            style={{ display: 'flex' }}
          >
            <ViewportSizeProvider>
              <Box className="container" fill="horizontal">
                <TopbarSlot
                  name={props.layoutConfig.topbarSlotId}
                  onMount={handleExtensionMount}
                  onUnmount={handleExtensionUnmount}
                />
                <Box className="container" style={{ flexDirection: 'row' }}>
                  <SidebarWrapper visible={showSidebar}>
                    <SidebarSlot
                      name={props.layoutConfig.sidebarSlotId}
                      onMount={handleExtensionMount}
                      onUnmount={handleExtensionUnmount}
                      className="container"
                    />
                  </SidebarWrapper>
                  <MainAreaContainer sidebarVisible={showSidebar} className="container">
                    <PluginSlot
                      name={props.layoutConfig.pluginSlotId}
                      onMount={handleExtensionMount}
                      onUnmount={handleExtensionUnmount}
                      className="container"
                    />
                    <Box>
                      <WidgetContainer>
                        {!props.isMobile && (
                          <CookieWidget
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              marginLeft: '1rem',
                              minWidth: '21rem',
                            }}
                          />
                        )}
                        <ScrollableWidgetArea>
                          <WidgetSlot
                            name={props.layoutConfig.rootWidgetSlotId}
                            onMount={handleExtensionMount}
                            onUnmount={handleExtensionUnmount}
                          />
                          <WidgetSlot
                            name={props.layoutConfig.widgetSlotId}
                            onMount={handleExtensionMount}
                            onUnmount={handleExtensionUnmount}
                          />
                        </ScrollableWidgetArea>
                      </WidgetContainer>
                    </Box>
                  </MainAreaContainer>
                </Box>
                {activeModal && (
                  <ModalSlot
                    key={activeModal.name}
                    name={activeModal.name}
                    onMount={handleModalNodeMount}
                    onUnmount={handleModalNodeUnmount}
                  />
                )}
                <ModalSlot
                  name={props.layoutConfig.modalSlotId}
                  onMount={handleExtensionMount}
                  onUnmount={handleExtensionUnmount}
                />
                {props.isMobile && <CookieWidget style={{ position: 'fixed', bottom: 0 }} />}
              </Box>
            </ViewportSizeProvider>
          </ThemeSelector>
        </Box>
      </Box>
    </I18nextProvider>
  );
};

export default LayoutWidget;
