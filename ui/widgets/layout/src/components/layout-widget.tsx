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
} = DS;

const LayoutWrapper = styled(Box)`
  flex-direction: row;
`;

const MainArea = styled(Box)``;

const SidebarSlot = styled(Box)<{ visible: boolean }>`
  z-index: 110;
  position: relative;
  top: 0;
  @media only screen and (max-width: ${props => props.theme.breakpoints.xlarge.value}px) {
    min-width: 4.5em;
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    position: sticky;
    top: 0;
    min-width: 3em;
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.small.value}px) {
    position: fixed;
    left: ${props => (props.visible ? 0 : -999)}px;
    top: 0;
    bottom: 0;
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
  :root,
  body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  };
  ${({ theme }) => css`
    // 1920-
    @media only screen and (max-width: ${theme.breakpoints.xlarge.value}px) {
      :root {
        font-size: 16px;
      }
    }
    // 1224-
    @media only screen and (max-width: ${theme.breakpoints.large.value}px) {
      :root {
        font-size: 16px;
      }
    }
    // 1024-
    @media only screen and (max-width: ${theme.breakpoints.medium.value}px) {
      :root {
        font-size: 15px;
      }
      ${PluginSlot} {
        margin: 0 0.5em 0 0.5em;
      }
    }
    // 550-
    @media only screen and (max-width: ${theme.breakpoints.small.value}px) {
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
          <LayoutWrapper>
            <SidebarSlot id={sidebarSlotId} visible={sidebarVisible} />
            <MainArea>
              <TopbarSlot id={topbarSlotId} />
              <PluginSlot id={pluginSlotId} />
            </MainArea>
          </LayoutWrapper>
        </ThemeSelector>
      </>
    );
  }
}

export default LayoutWidget;
