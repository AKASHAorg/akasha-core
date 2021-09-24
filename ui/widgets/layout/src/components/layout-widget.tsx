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
import { ModalSlot, PluginSlot, TopbarSlot, SidebarSlot, WidgetSlot } from './styled-slots';
import CookieWidget from './cookie-widget';
import { EventTypes, ItemTypes, UIEventData } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import i18next from '../i18n';
import { I18nextProvider } from 'react-i18next';

const {
  Box,
  lightTheme,
  // darkTheme,
  ThemeSelector,
  responsiveBreakpoints,
  // ViewportSizeProvider,
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
  }, [activeModal, props.uiEvents, handleModalNodeUnmount]);

  return (
    <I18nextProvider i18n={i18next}>
      <Box className="container">
        <GlobalStyle theme={{ breakpoints: responsiveBreakpoints.global.breakpoints }} />
        <Box className="container">
          <ThemeSelector
            availableThemes={[lightTheme]}
            settings={{ activeTheme: 'Light-Theme' }}
            style={{ display: 'flex' }}
          >
            <Box className="container" fill="horizontal">
              <TopbarSlot
                name={props.layoutConfig.topbarSlotId}
                onMount={handleExtensionMount}
                onUnmount={handleExtensionUnmount}
              />
              <Box
                className="container"
                fill="horizontal"
                justify="around"
                style={{ flexDirection: 'row', alignItems: 'stretch' }}
              >
                <SidebarWrapper visible={showSidebar}>
                  <Box width={{ width: '100%' }} />
                  <SidebarSlot
                    name={props.layoutConfig.sidebarSlotId}
                    onMount={handleExtensionMount}
                    onUnmount={handleExtensionUnmount}
                  />
                </SidebarWrapper>
                <MainAreaContainer sidebarVisible={showSidebar} className="container">
                  <Box direction="row">
                    <PluginSlot
                      name={props.layoutConfig.pluginSlotId}
                      onMount={handleExtensionMount}
                      onUnmount={handleExtensionUnmount}
                      className="container"
                    />
                    <WidgetContainer>
                      <WidgetAreaContainer>
                        {!props.isMobile && (
                          <CookieWidget
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              marginLeft: '1rem',
                              maxWidth: '21rem',
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
                      </WidgetAreaContainer>
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
          </ThemeSelector>
        </Box>
      </Box>
    </I18nextProvider>
  );
};

export default LayoutWidget;
