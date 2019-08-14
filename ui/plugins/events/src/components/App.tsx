import SidebarWidget from '@akashaproject/ui-widget-sidebar';
import React, { PureComponent } from 'react';
// @ts-ignore
import Parcel from 'single-spa-react/parcel';
// @ts-ignore
import styled from 'styled-components';

export interface IProps {
  sdkModules: any;
  logger: any;
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

const PageLayout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Page = styled.div`
  width: 100%;
  height: 100%;
  margin-left: 64px;
  padding-left: 16px;
  // remove this
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

// this example is to showcase how the consumers can be outside of component, reusable
// maybe react hooks call inside?
// tslint:disable-next-line:no-console
const subConsumer = (data: any) => console.log('sdkModule call', data);

export default class App extends PureComponent<IProps> {
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

  public render() {
    if (this.state.hasErrors) {
      return <div>Oh no, something went wrong in {'events-app'}</div>;
    }
    return (
      <>
        <PageLayout>
          <Page>
            Events Page!
            <button onClick={this.onClickSdk} type={'button'}>
              sdk-common
            </button>
          </Page>
        </PageLayout>
        <Parcel
          config={SidebarWidget.widget}
          appendTo={document.getElementById('root')}
          wrapWith="div"
        />
      </>
    );
  }
}
