import DS from '@akashaproject/design-system';
import React, { PureComponent, Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import { feedInit, FeedProvider, feedReducer } from '../state/feed';
import Routes from './routes';

const { ViewportSizeProvider, Box, styled } = DS;

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

// this example is to showcase how the consumers can be outside of component, reusable
// maybe react hooks call inside?
// tslint:disable-next-line:no-console
const subConsumer = (data: any) => console.log('sdkModule call', data);

const FeedPlaceholder = styled(Box)`
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    max-width: 60%;
  }
`;
class App extends PureComponent<IProps> {
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
  // @TODO: remove this after having a real use-case
  public onClickSdk = () => {
    const { sdkModules, logger } = this.props;
    logger.info('sdk call');
    const callMethod = sdkModules.commons.validator_service({ method: 'validator', args: {} });
    callMethod.subscribe(subConsumer);
  };
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
      <ViewportSizeProvider>
          <Suspense fallback={<FeedPlaceholder>Loading resources...</FeedPlaceholder>}>
            <I18nextProvider i18n={i18n ? i18n : null}>
              <FeedProvider reducer={feedReducer} initialState={feedInit()}>
                <Routes {...this.props} />
              </FeedProvider>
            </I18nextProvider>
          </Suspense>
      </ViewportSizeProvider>
    );
  }
}

export default App;
