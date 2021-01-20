import * as React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

import PostPage from './post-page/post-page';
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
  onError: (err: Error) => void;
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
        <Route path={`${path}/:userId/post/:postId`}>
          <PostPage
            slotId={props.layout.app.modalSlotId}
            channels={props.sdkModules}
            globalChannel={props.globalChannel}
            logger={props.logger}
            ethAddress={props.ethAddress}
            pubKey={props.pubKey}
            flagged={props.flagged}
            reportModalOpen={props.reportModalOpen}
            setFlagged={props.setFlagged}
            setReportModalOpen={props.setReportModalOpen}
            showLoginModal={props.showLoginModal}
            navigateToUrl={props.singleSpa.navigateToUrl}
          />
        </Route>
        <Route path={`${path}/:userId`}>
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
