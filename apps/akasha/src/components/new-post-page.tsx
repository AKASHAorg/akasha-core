import * as React from 'react';
import DS from '@akashaproject/design-system';
import { RouteComponentProps } from 'react-router-dom';

const { Helmet } = DS;

interface NewPostPageProps {
  globalChannel: any;
  sdkModules: any;
  logger: any;
}

const NewPostPage: React.FC<NewPostPageProps & RouteComponentProps> = () => {
  return (
    <>
      <Helmet>
        <title>Write something.. | AKASHA App</title>
      </Helmet>
      <>New Post Page</>
    </>
  );
};

export default NewPostPage;
