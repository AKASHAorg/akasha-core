import DS from '@akashaproject/design-system';
import React, { PureComponent } from 'react';
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
import { Subscription } from 'rxjs';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import Fetch from 'i18next-fetch-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import { initReactI18next } from 'react-i18next';

const {
  Box,
  lightTheme,
  // darkTheme,
  ThemeSelector,
  responsiveBreakpoints,
  ViewportSizeProvider,
  // useViewportSize,
} = DS;

interface LayoutWidgetState {
  hasErrors: boolean;
  errorMessage: string;
  showSidebar?: boolean;
  modals: NonNullable<UIEventData['data']>[];
}

class LayoutWidget extends PureComponent<RootComponentProps, LayoutWidgetState> {
  public state: LayoutWidgetState;

  public uiEventsSub?: Subscription;

  constructor(props: RootComponentProps) {
    super(props);
    this.state = {
      hasErrors: false,
      errorMessage: '',
      modals: [],
    };
  }

  public componentDidCatch(err: Error, info: React.ErrorInfo) {
    this.setState({
      hasErrors: true,
      errorMessage: `${err.message} :: ${info.componentStack}`,
    });
    // tslint:disable-next-line:no-console
    console.error(err, info);
  }

  public showSidebar = () => {
    this.setState({ showSidebar: true });
  };

  public hideSidebar = () => {
    this.setState({ showSidebar: false });
  };

  public componentDidMount() {
    // TODO: move these through event bus
    window.addEventListener('layout:showSidebar', this.showSidebar);
    window.addEventListener('layout:hideSidebar', this.hideSidebar);

    this.uiEventsSub = this.props.uiEvents.subscribe({
      next: (eventInfo: UIEventData) => {
        if (eventInfo.event === EventTypes.ModalMountRequest && eventInfo.data) {
          if (this.state.modals.some(modal => modal.name === eventInfo.data?.name)) {
            return;
          }
          this.setState(prev => ({
            ...prev,
            modals: prev.modals.concat([eventInfo.data as NonNullable<UIEventData['data']>]),
          }));
        }
        if (eventInfo.event === EventTypes.ModalUnmountRequest && eventInfo.data?.name) {
          if (this.state.modals.find(mod => mod.name === eventInfo.data?.name)) {
            this.setState(prev => ({
              ...prev,
              modals: prev.modals.filter(mod => mod.name !== eventInfo.data?.name),
            }));
          }
        }
      },
      error(err: Error) {
        this.setState({
          hasErrors: true,
          errorMessage: err.message,
        });
      },
    });
  }

  public componentWillUnmount() {
    window.removeEventListener('layout:showSidebar', this.showSidebar);
    window.removeEventListener('layout:hideSidebar', this.hideSidebar);
    if (this.uiEventsSub) {
      this.uiEventsSub.unsubscribe();
    }
  }

  public onExtensionMount = (name: string) => {
    this.props.uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: {
        name,
      },
    });
  };
  public onExtensionUnmount = (name: string) => {
    this.props.uiEvents.next({
      event: EventTypes.ExtensionPointUnmount,
      data: {
        name,
      },
    });
  };
  public onModalNodeMount = (name: string) => {
    this.props.uiEvents.next({
      event: EventTypes.ModalMount,
      data: this.state.modals.find(modal => modal.name === name),
    });
  };
  public onModalNodeUnmount = (name: string) => {
    this.props.uiEvents.next({
      event: EventTypes.ModalUnmount,
      data: { name },
    });
  };
  public render() {
    const { logger, layoutConfig } = this.props;
    const {
      sidebarSlotId,
      topbarSlotId,
      pluginSlotId,
      rootWidgetSlotId,
      widgetSlotId,
      modalSlotId,
    } = layoutConfig;
    const { showSidebar } = this.state;

    if (this.state.hasErrors) {
      return (
        <div>
          Oh no, something went wrong in layout-widget
          <div>
            <code>{this.state.errorMessage}</code>
          </div>
        </div>
      );
    }

    const sidebarVisible = Boolean(showSidebar);

    i18next
      .use(initReactI18next)
      .use(Backend)
      .use(LanguageDetector)
      .use({
        type: 'logger',
        log: logger.info,
        warn: logger.warn,
        error: logger.error,
      })
      .init({
        fallbackLng: 'en',
        ns: ['ui-widget-layout'],
        saveMissing: false,
        saveMissingTo: 'all',
        load: 'languageOnly',
        debug: true,
        cleanCode: true,
        keySeparator: false,
        defaultNS: 'ui-widget-layout',
        backend: {
          backends: [LocalStorageBackend, Fetch],
          backendOptions: [
            {
              prefix: 'i18next_res_v0',
              expirationTime: 24 * 60 * 60 * 1000,
            },
            {
              loadPath: '/locales/{{lng}}/{{ns}}.json',
            },
          ],
        },
      });

    return (
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
                  name={topbarSlotId}
                  onMount={this.onExtensionMount}
                  onUnmount={this.onExtensionUnmount}
                />
                <Box className="container" style={{ flexDirection: 'row' }}>
                  <SidebarWrapper visible={sidebarVisible}>
                    <SidebarSlot
                      name={sidebarSlotId}
                      onMount={this.onExtensionMount}
                      onUnmount={this.onExtensionUnmount}
                      className="container"
                    />
                  </SidebarWrapper>
                  <MainAreaContainer sidebarVisible={sidebarVisible} className="container">
                    <PluginSlot
                      name={pluginSlotId}
                      onMount={this.onExtensionMount}
                      onUnmount={this.onExtensionUnmount}
                      className="container"
                    />
                    <Box>
                      <WidgetContainer>
                        {!this.props.isMobile && (
                          <CookieWidget style={{ position: 'absolute', bottom: 0 }} />
                        )}
                        <ScrollableWidgetArea>
                          <WidgetSlot
                            name={rootWidgetSlotId}
                            onMount={this.onExtensionMount}
                            onUnmount={this.onExtensionUnmount}
                          />
                          <WidgetSlot
                            name={widgetSlotId}
                            onMount={this.onExtensionMount}
                            onUnmount={this.onExtensionUnmount}
                          />
                        </ScrollableWidgetArea>
                      </WidgetContainer>
                    </Box>
                  </MainAreaContainer>
                </Box>
                {this.state.modals.map(modalData => (
                  <ModalSlot
                    key={modalData.name}
                    name={modalData.name}
                    onMount={this.onModalNodeMount}
                    onUnmount={this.onModalNodeUnmount}
                  />
                ))}
                <ModalSlot
                  name={modalSlotId}
                  onMount={this.onExtensionMount}
                  onUnmount={this.onExtensionUnmount}
                />
                {this.props.isMobile && <CookieWidget style={{ position: 'fixed', bottom: 0 }} />}
              </Box>
            </ViewportSizeProvider>
          </ThemeSelector>
        </Box>
      </Box>
    );
  }
}

export default LayoutWidget;
