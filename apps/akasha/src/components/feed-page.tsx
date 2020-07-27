import * as React from 'react';
import DS from '@akashaproject/design-system';
import { RouteComponentProps } from 'react-router-dom';

const { Helmet } = DS;

export interface FeedPageProps {
  globalChannel: any;
  sdkModules: any;
  logger: any;
}

const FeedPage: React.FC<FeedPageProps & RouteComponentProps> = () => {
  return (
    <>
      <Helmet>
        <title>AKASHA Feed | Ethereum.world</title>
      </Helmet>
      Feed page
    </>
  );
};

export default FeedPage;
