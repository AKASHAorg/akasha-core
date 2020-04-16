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

const LayoutWrapper = styled(Box)`
  flex-direction: row;
  width: 100%;
`;

const MainArea = styled(Box)`
  width: 100%;
`;

const SidebarSlot = styled(Box)<{ visible: boolean }>`
  position: relative;
  top: 0;
  @media only screen and (max-width: ${props => props.theme.breakpoints.xlarge.value}px) {
    min-width: 15rem;
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    position: sticky;
    top: 0;
    min-width: 15rem;
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.small.value}px) {
    position: fixed;
    left: ${props => (props.visible ? 0 : -999)}px;
    top: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
  }
`;
const TopbarSlot = styled(Box)`
  z-index: 100;
  position: sticky;
  top: 0;
  @media screen and (min-width: ${props => props.theme.breakpoints.small.value}px) {
    display: none;
  }
`;
const PluginSlot = styled(Box)``;

const GlobalStyle = createGlobalStyle<{
  // @TODO: replace any with design-system's exported theme type
  theme: any;
}>`
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
  };
  body {
    overflow-y: auto;
  }
  ${props => css`
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
        font-size: 15px;
      }
      ${PluginSlot} {
        margin: 0 0.5em 0 0.5em;
      }
    }
    // 550 and lower
    @media only screen and (max-width: ${props.theme.breakpoints.small.value}px) {
      :root {
        font-size: 14px;
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
    const { sidebarSlotId, topbarSlotId, pluginSlotId } = this.props;
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
        >
          <ViewportSizeProvider>
            <LayoutWrapper>
              <SidebarSlot id={sidebarSlotId} visible={sidebarVisible} />
              <MainArea fill={true}>
                <TopbarSlot id={topbarSlotId} />
                <PluginSlot id={pluginSlotId} flex={true} fill={true} />
              </MainArea>
            </LayoutWrapper>
          </ViewportSizeProvider>
        </ThemeSelector>
      </>
    );
  }
}

export default LayoutWidget;
