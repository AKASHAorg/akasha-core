import DS from '@akashaproject/design-system';
import React, { PureComponent, Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import Routes from './routes';

const { ViewportSizeProvider, Box, styled, lightTheme, darkTheme, ThemeSelector } = DS;

export interface IProps {
  singleSpa: any;
  activeWhen: {
    path: string;
  };
  mountParcel: (config: any, props: any) => void;
  rootNodeId: string;
  sdkModules: any;
  logger: any;
  i18n?: any;
  globalChannel: any;
  isMobile: boolean;
}

/**
 * This is the entry point of a plugin.
 * Here you can add react-router, react-redux, etc..
 *
 * @todo Add more documentation for this component
 *
 * @warning :: Root component for a plugin should always extend React.Component
 * @warning :: Always use default export
 */

const FeedPlaceholder = styled(Box)`
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    max-width: 60%;
  }
`;

class FeedPluginRoot extends PureComponent<IProps> {
  public state: { hasErrors: boolean };

  constructor(props: IProps) {
    super(props);
    this.state = {
      hasErrors: false,
    };
  }

  public componentDidCatch(err: Error, info: React.ErrorInfo) {
    this.setState({
      hasErrors: true,
    });
    const { logger } = this.props;
    logger.error(err, info);
  }

  public handleNavigation(href: string) {
    return (ev: React.SyntheticEvent) => {
      this.props.singleSpa.navigateToUrl(href);
      ev.preventDefault();
    };
  }

  public render() {
    const { i18n } = this.props;

    if (this.state.hasErrors) {
      return <div>Oh no, something went wrong in {'feed-plugin'}</div>;
    }

    return (
      <>
        <DS.Helmet>
          <title>My Feed Page</title>
        </DS.Helmet>
        <ViewportSizeProvider>
          <ThemeSelector
            settings={{ activeTheme: 'Light-Theme' }}
            availableThemes={[lightTheme, darkTheme]}
            plain={true}
            style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
          >
            <Suspense fallback={<FeedPlaceholder>Loading resources...</FeedPlaceholder>}>
              <I18nextProvider i18n={i18n ? i18n : null}>
                <Routes {...this.props} />
              </I18nextProvider>
            </Suspense>
          </ThemeSelector>
        </ViewportSizeProvider>
      </>
    );
  }
}

export default FeedPluginRoot;
