import DS from '@akashaproject/design-system';
import { i18n as I18nType } from 'i18next';
import React, { PureComponent } from 'react';
import { GlobalStyle } from './global-style';
import { MainAreaContainer, WidgetContainer } from './styled-containers';
import { ModalSlot, PluginSlot, TopbarSlot, WidgetSlot } from './styled-slots';

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

const ScrollableWidgetArea = styled.div`
  ${props => css`
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    @media screen and (min-width: ${props.theme.breakpoints.medium.value}px) {
      overflow-y: auto;
      overflow-x: hidden;
      height: calc(100vh - ${TOPBAR_HEIGHT}em);
    }
  `}
`;

export interface IProps {
  i18n: I18nType;
  sdkModules: any;
  singleSpa: any;
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

  public render() {
    const { topbarSlotId, pluginSlotId, rootWidgetSlotId, widgetSlotId, modalSlotId } = this.props;

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
                  <MainAreaContainer className="container">
                    <PluginSlot id={pluginSlotId} className="container" />
                    <WidgetSlot>
                      <WidgetContainer>
                        <ScrollableWidgetArea>
                          <Box id={rootWidgetSlotId} />
                          <Box id={widgetSlotId} />
                        </ScrollableWidgetArea>
                      </WidgetContainer>
                    </WidgetSlot>
                  </MainAreaContainer>
                </Box>
                <ModalSlot id={modalSlotId} />
              </Box>
            </ViewportSizeProvider>
          </ThemeSelector>
        </Box>
      </Box>
    );
  }
}

export default LayoutWidget;
