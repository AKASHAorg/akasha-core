import DS from '@akashaproject/design-system';
import { i18n as I18nType } from 'i18next';
import React, { PureComponent } from 'react';

const {
  createGlobalStyle,
  css,
  Box,
  styled,
  lightTheme,
  // darkTheme,
  ThemeSelector,
  responsiveBreakpoints,
  ViewportSizeProvider,
} = DS;

const MainArea = styled(Box)<{ sidebarVisible: boolean }>`
  width: 100%;
`;

const SidebarSlot = styled(Box)<{ visible: boolean }>`
  top: 3rem;
  z-index: 999;
  ${props => {
    if (props.visible) {
      return css`
        bottom: 0;
        left: 0;
        position: absolute;
        min-width: 13.375em;
      `;
    }
    return css``;
  }}
  @media screen and (max-width: ${props => props.theme.breakpoints.small.value}px) {
    ${props => {
      if (props.visible) {
        return css`
          min-width: 90%;
        `;
      }
      return '';
    }}
  }
`;

const TopbarSlot = styled(Box)`
  z-index: 100;
  width: 100%;
  height: 3rem;
`;

const PluginSlot = styled(Box)`
  height: 100%;
  flex: 1 1;
  flex-basis: 40em;
  margin-right: 2em;
  @media screen and (max-width: ${props => props.theme.breakpoints.small.value}px) {
    flex-basis: 40em;
    margin-right: 0;
    flex: 0.8 0;
    margin: 0 auto;
  }
`;

const WidgetSlot = styled(Box)`
  height: 100%;
  align-items: center;
  flex: 2 2;
  flex-basis: 20em;
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    flex: 1 0.8;
    flex-basis: 25em;
  }
  @media screen and (max-width: 670px) {
    display: none;
  }
  > div {
    flex-shrink: 0;
    width: 100%;
  }
`;

const GlobalStyle = createGlobalStyle<{ theme: any }>`
  html {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  *, *:before, *:after {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: inherit;
  }
  :root,
  body {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    display: flex;
  };
  body {
    overflow-y: auto;
  }
  ${props => css<any>`
    // 1920 and lower
    @media only screen and (max-width: ${props.theme.breakpoints.xlarge.value}px) {
      :root {
        font-size: 16px;
      }
    }
    // 1224 and lower
    @media only screen and (max-width: ${props.theme.breakpoints.large.value}px) {
      :root {
        font-size: 16px;
      }
    }
    // 1024 and lower
    @media only screen and (max-width: ${props.theme.breakpoints.medium.value}px) {
      :root {
        font-size: 16px;
      }
    }
    // 550 and lower
    @media only screen and (max-width: ${props.theme.breakpoints.small.value}px) {
      :root {
        font-size: 18px;
        line-height: 1.312;
      }
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
      <>
        <GlobalStyle theme={{ breakpoints: responsiveBreakpoints.global.breakpoints }} />
        <ThemeSelector
          availableThemes={[lightTheme]}
          settings={{ activeTheme: 'Light-Theme' }}
          themeReadyEvent={this.props.themeReadyEvent}
          style={{ height: '100%' }}
        >
          <ViewportSizeProvider>
            <Box fill={true}>
              <TopbarSlot id={topbarSlotId} />
              <Box direction="row" fill={true}>
                <SidebarSlot animation="fadeIn" id={sidebarSlotId} visible={sidebarVisible} />
                <MainArea fill={true} align="center" sidebarVisible={sidebarVisible}>
                  <Box
                    fill="vertical"
                    flex={true}
                    responsive={true}
                    direction="row"
                    width="60em"
                    margin={{ top: '1em' }}
                    pad="0 0.5em"
                  >
                    <PluginSlot id={pluginSlotId} fill={true} />
                    <WidgetSlot fill={true}>
                      <Box id={rootWidgetSlotId} />
                      <Box id={widgetSlotId} />
                    </WidgetSlot>
                  </Box>
                </MainArea>
              </Box>
            </Box>
          </ViewportSizeProvider>
          <div id={modalSlotId} />
        </ThemeSelector>
      </>
    );
  }
}

export default LayoutWidget;
