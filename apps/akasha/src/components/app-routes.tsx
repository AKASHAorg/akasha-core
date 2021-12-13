import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import DS from '@akashaproject/design-system';
import { useGetLogin, useGetProfile } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';

import FeedPage from './feed-page/feed-page';
import PostPage from './post-page/post-page';
import InvitePage from './post-page/invite-page';
import TagFeedPage from './tag-feed-page/tag-feed-page';

import routes, { FEED, rootRoute, POST, REPLY, TAGS, INVITE } from '../routes';
import ReplyPage from './post-page/reply-page';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const loginQuery = useGetLogin();

  const profileDataReq = useGetProfile(loginQuery.data?.pubKey);
  const loggedProfileData = profileDataReq.data;

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    props.navigateToModal({ name: 'login', redirectTo });
  };

  return (
    <Router>
      <Box>
        <Switch>
          <Route path={routes[FEED]}>
            <FeedPage
              {...props}
              loggedProfileData={loggedProfileData}
              loginState={loginQuery.data}
              showLoginModal={showLoginModal}
            />
          </Route>
          <Route path={`${routes[POST]}/:postId`}>
            <PostPage
              {...props}
              loginState={loginQuery.data}
              showLoginModal={showLoginModal}
              isMobile={props.isMobile}
            />
          </Route>
          <Route path={`${routes[TAGS]}/:tagName`}>
            <TagFeedPage
              {...props}
              loggedProfileData={loggedProfileData}
              loginState={loginQuery.data}
              showLoginModal={showLoginModal}
            />
          </Route>
          <Route path={`${routes[REPLY]}/:commentId`}>
            <ReplyPage {...props} />
          </Route>
          <Route path={`${routes[INVITE]}/:inviteCode`}>
            <InvitePage {...props} />
          </Route>
          <Redirect exact={true} from={rootRoute} to={routes[FEED]} />
        </Switch>
      </Box>
    </Router>
  );
};

export default AppRoutes;
