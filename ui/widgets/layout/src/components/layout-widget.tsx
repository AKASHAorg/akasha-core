import DS from '@akashaproject/design-system';
import { i18n as I18nType } from 'i18next';
import React, { PureComponent } from 'react';
import { GlobalStyle } from './global-style';
import { BaseContainer, MainAreaContainer, WidgetContainer } from './styled-containers';
import { ModalSlot, PluginSlot, SidebarSlot, TopbarSlot, WidgetSlot } from './styled-slots';

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

const AppWrapper = styled(BaseContainer)`
  flex-basis: 0%;
  flex-grow: 1;
  flex-shrink: 1;
`;

const ResponsivePage = styled(BaseContainer)`
  flex-grow: 1;
  flex-direction: row;
  justify-content: stretch;
`;

const SidebarWrapper = styled(BaseContainer)<{ visible: boolean }>`
  z-index: 999;
  flex-grow: 1;
  height: calc(100vh - 3.6em);
  top: 3.6em;
  position: sticky;
  @media screen and (max-width: ${props => props.theme.breakpoints.small.value}px) {
    ${props => {
      if (props.visible) {
        return css`
          position: fixed;
          top: 3rem;
          width: 90vw;
          height: calc(100vh - 3rem);
          // @media all and (device-width: 375px) and (device-height: 812px) {
          //   height: calc(812px - 3rem);
          // }
        `;
      }
      return css`
        display: none;
      `;
    }}
  }
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
  themeReadyEvent: () => void;
}

class LayoutWidget extends PureComponent<IProps> {
  public state: {
    hasErrors: boolean;
    errorMessage: string;
    showSidebar?: boolean;
  };

  constructor(props: IProps) {
    super(props);
    this.state = {
      hasErrors: false,
      errorMessage: '',
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
      <AppWrapper>
        <GlobalStyle theme={{ breakpoints: responsiveBreakpoints.global.breakpoints }} />
        <ThemeSelector
          availableThemes={[lightTheme]}
          settings={{ activeTheme: 'Light-Theme' }}
          themeReadyEvent={this.props.themeReadyEvent}
          style={{ display: 'flex' }}
        >
          <AppWrapper>
            <ViewportSizeProvider>
              <BaseContainer>
                <TopbarSlot id={topbarSlotId} />
                <AppWrapper>
                  <ResponsivePage>
                    <SidebarWrapper visible={sidebarVisible}>
                      <SidebarSlot id={sidebarSlotId} visible={sidebarVisible} />
                    </SidebarWrapper>
                    <MainAreaContainer sidebarVisible={sidebarVisible}>
                      <PluginSlot id={pluginSlotId} />
                      <WidgetSlot>
                        <WidgetContainer>
                          <Box id={rootWidgetSlotId} />
                          <Box id={widgetSlotId} />
                        </WidgetContainer>
                      </WidgetSlot>
                    </MainAreaContainer>
                  </ResponsivePage>
                </AppWrapper>
                <ModalSlot id={modalSlotId} />
              </BaseContainer>
            </ViewportSizeProvider>
          </AppWrapper>
        </ThemeSelector>
      </AppWrapper>
    );
  }
}

export default LayoutWidget;
