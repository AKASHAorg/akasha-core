import DS from '@akashaproject/design-system';
import { i18n as I18nType } from 'i18next';
import React, { PureComponent } from 'react';
import { GlobalStyle } from './global-style';
import { BaseContainer, MainAreaContainer, WidgetContainer } from './styled-containers';
import { ModalSlot, PluginSlot, TopbarSlot, SidebarSlot, WidgetSlot } from './styled-slots';
import CookieWidget from './cookie-widget';

const {
  Box,
  styled,
  css,
  lightTheme,
  // darkTheme,
  ThemeSelector,
  responsiveBreakpoints,
  ViewportSizeProvider,
  // useViewportSize,
} = DS;

const TOPBAR_HEIGHT = 4;

const SidebarWrapper = styled(BaseContainer)<{ visible: boolean }>`
  z-index: 999;
  flex-grow: 1;
  height: calc(100vh - ${TOPBAR_HEIGHT}rem);
  top: ${TOPBAR_HEIGHT}rem;
  position: sticky;
  @media screen and (max-width: ${props => props.theme.breakpoints.small.value}px) {
    ${props => {
      if (props.visible) {
        return css`
          position: fixed;
          top: ${TOPBAR_HEIGHT}rem;
          width: 90vw;
          height: calc(100vh - ${TOPBAR_HEIGHT + 0.3}rem);
        `;
      }
      return css`
        display: none;
      `;
    }}
  }
`;

const ScrollableWidgetArea = styled.div`
  ${props => css`
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    @media screen and (min-width: ${props.theme.breakpoints.medium.value}px) {
      overflow-y: auto;
      overflow-x: hidden;
      height: calc(100vh - ${TOPBAR_HEIGHT + 0.3}rem);
    }
  `}
`;

export interface IProps {
  i18n: I18nType;
  sdkModules: any;
  singleSpa: any;
  sidebarSlotId: string;
  topbarSlotId: string;
  pluginSlotId: string;
  rootWidgetSlotId: string;
  widgetSlotId: string;
  modalSlotId: string;
  isMobile?: boolean;
  themeReadyEvent: () => void;
}

class LayoutWidget extends PureComponent<IProps> {
  public state: {
    hasErrors: boolean;
    errorMessage: string;
    showSidebar?: boolean;
    consent?: boolean;
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      hasErrors: false,
      errorMessage: '',
      consent: false,
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
    window.addEventListener('layout:showSidebar', this.showSidebar);
    window.addEventListener('layout:hideSidebar', this.hideSidebar);
    const cookieConsent = localStorage.getItem('ew-cookie-consent');
    if (cookieConsent) {
      this.setState({ ...this.state, consent: true });
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('layout:showSidebar', this.showSidebar);
    window.removeEventListener('layout:hideSidebar', this.hideSidebar);
  }

  public render() {
    const {
      sidebarSlotId,
      topbarSlotId,
      pluginSlotId,
      rootWidgetSlotId,
      widgetSlotId,
      modalSlotId,
    } = this.props;
    const { showSidebar } = this.state;

    const acceptCookie = (all: boolean = false) => {
      localStorage.setItem('ew-cookie-consent', `${all ? 'all' : 'essential'}`);
      return this.setState({ ...this.state, consent: true });
    };

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
      <Box className="container" fill="horizontal">
        <GlobalStyle theme={{ breakpoints: responsiveBreakpoints.global.breakpoints }} />
        <Box className="container">
          <ThemeSelector
            availableThemes={[lightTheme]}
            settings={{ activeTheme: 'Light-Theme' }}
            themeReadyEvent={this.props.themeReadyEvent}
            style={{ display: 'flex' }}
          >
            <ViewportSizeProvider>
              <Box className="container" fill="horizontal">
                <TopbarSlot id={topbarSlotId} />
                <Box className="container" style={{ flexDirection: 'row' }}>
                  <SidebarWrapper visible={sidebarVisible}>
                    <SidebarSlot
                      id={sidebarSlotId}
                      visible={sidebarVisible}
                      className="container"
                    />
                  </SidebarWrapper>
                  <MainAreaContainer sidebarVisible={sidebarVisible} className="container">
                    <PluginSlot id={pluginSlotId} className="container" />
                    <WidgetSlot>
                      <WidgetContainer>
                        {!this.state.consent && !this.props.isMobile && (
                          <CookieWidget
                            style={{ position: 'absolute', bottom: 0 }}
                            acceptCookie={acceptCookie}
                          />
                        )}
                        <ScrollableWidgetArea>
                          <Box id={rootWidgetSlotId} />
                          <Box id={widgetSlotId} />
                        </ScrollableWidgetArea>
                      </WidgetContainer>
                    </WidgetSlot>
                  </MainAreaContainer>
                </Box>
                <ModalSlot id={modalSlotId} />
                {!this.state.consent && this.props.isMobile && (
                  <CookieWidget
                    style={{ position: 'fixed', bottom: 0 }}
                    acceptCookie={acceptCookie}
                  />
                )}
              </Box>
            </ViewportSizeProvider>
          </ThemeSelector>
        </Box>
      </Box>
    );
  }
}

export default LayoutWidget;
