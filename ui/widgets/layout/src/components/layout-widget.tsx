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

interface LayoutWidgetState {
  hasErrors: boolean;
  errorMessage: string;
  showSidebar?: boolean;
  activeModal: UIEventData['data'] | null;
}

class LayoutWidget extends PureComponent<RootComponentProps, LayoutWidgetState> {
  public state: LayoutWidgetState;

  public uiEventsSub?: Subscription;

  constructor(props: RootComponentProps) {
    super(props);
    this.state = {
      hasErrors: false,
      errorMessage: '',
      activeModal: null,
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
          if (this.state.activeModal && this.state.activeModal.name !== eventInfo.data.name) {
            this.onModalNodeUnmount(this.state.activeModal.name);
          }

          this.setState(prev => ({
            ...prev,
            activeModal: eventInfo.data,
          }));
        }
        if (eventInfo.event === EventTypes.ModalUnmountRequest && eventInfo.data?.name) {
          this.setState(prev => ({
            ...prev,
            activeModal: null,
          }));
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
  public onModalNodeMount = (_name: string) => {
    this.props.uiEvents.next({
      event: EventTypes.ModalMount,
      data: this.state.activeModal,
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
                  {this.state.activeModal && (
                    <ModalSlot
                      key={this.state.activeModal.name}
                      name={this.state.activeModal.name}
                      onMount={this.onModalNodeMount}
                      onUnmount={this.onModalNodeUnmount}
                    />
                  )}
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
      </I18nextProvider>
    );
  }
}

export default LayoutWidget;
