import * as React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';

import PostsList from './posts-list';

export interface PostsPageProps {
  globalChannel: any;
  sdkModules: any;
  logger: any;
  ethAddress: string | null;
  pubKey: string | null;
  navigateToUrl: (url: string) => void;
  flagged: string;
  reportModalOpen: boolean;
  setFlagged: React.Dispatch<React.SetStateAction<string>>;
  setReportModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showLoginModal: () => void;
  onError: (err: IAkashaError) => void;
}

const PostsPage: React.FC<PostsPageProps & RootComponentProps> = props => {
  const { path } = useRouteMatch();
  return (
    <>
      <Switch>
        <Route exact={true} path={`${path}/my-posts`}>
          <PostsList
            channels={props.sdkModules}
            globalChannel={props.globalChannel}
            logger={props.logger}
            ethAddress={props.ethAddress}
            pubKey={props.pubKey}
            navigateToUrl={props.navigateToUrl}
          />
        </Route>
        <Redirect exact={true} from={path} to={`${path}/my-posts`} />
      </Switch>
    </>
  );
};

export default PostsPage;
