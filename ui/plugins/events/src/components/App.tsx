import SidebarWidget from '@akashaproject/ui-widget-sidebar';
import React, { PureComponent } from 'react';
// @ts-ignore
import Parcel from 'single-spa-react/parcel';
// @ts-ignore
import styled from 'styled-components';
import Routes from './routes';

export interface IProps {
  activeWhen: {
    path: string;
  };
  mountParcel: (config: any, props: any) => void;
  rootNodeId: string;
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
`;
export default class App extends PureComponent<IProps> {
  public state: { hasErrors: boolean };

  constructor(props: IProps) {
    super(props);
    this.state = {
      hasErrors: false
    };
  }

  public componentDidCatch(err: Error, info: React.ErrorInfo) {
    this.setState({
      hasErrors: true
    });
    // tslint:disable-next-line:no-console
    console.error(err, info);
  }

  public render() {
    if (this.state.hasErrors) {
      return <div>Oh no, something went wrong in {'events-app'}</div>;
    }
    return (
      <>
        <PageLayout>
          <Page>
            <Routes {...this.props} />
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
