import * as React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

import PostPage from './post-page';
import PostsList from './posts-list';

export interface PostsPageProps {
  globalChannel: any;
  sdkModules: any;
  logger: any;
  navigateToUrl: (url: string) => void;
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
            navigateToUrl={props.navigateToUrl}
          />
        </Route>
        <Route path={`${path}/:userId/post/:postId`}>
          <PostPage
            slotId={props.layout.modalSlotId}
            channels={props.sdkModules}
            globalChannel={props.globalChannel}
            logger={props.logger}
            showLoginModal={props.showLoginModal}
          />
        </Route>
        <Route path={`${path}/:userId`}>
          <PostsList
            channels={props.sdkModules}
            globalChannel={props.globalChannel}
            logger={props.logger}
            navigateToUrl={props.navigateToUrl}
          />
        </Route>
        <Redirect exact={true} from={path} to={`${path}/my-posts`} />
      </Switch>
    </>
  );
};

export default PostsPage;
