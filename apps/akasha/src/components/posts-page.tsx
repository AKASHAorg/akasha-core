import * as React from 'react';
import DS from '@akashaproject/design-system';
import { RouteComponentProps } from 'react-router-dom';

const { Helmet } = DS;

export interface PostsPageProps {
  globalChannel: any;
  sdkModules: any;
  logger: any;
}

const PostsPage: React.FC<PostsPageProps & RouteComponentProps> = () => {
  return (
    <>
      <Helmet>
        <title>AKASHA Posts | Ethereum.world</title>
      </Helmet>
      Posts page
    </>
  );
};

export default PostsPage;
