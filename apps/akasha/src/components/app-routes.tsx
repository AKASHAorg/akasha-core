import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import DS from '@akashaproject/design-system';
import { useErrors } from '@akashaproject/ui-awf-hooks';
import { useGetLogin } from '@akashaproject/ui-awf-hooks/lib/use-login.new';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useGetProfile } from '@akashaproject/ui-awf-hooks/lib/use-profile.new';
import { ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';

import FeedPage from './feed-page/feed-page';
import PostPage from './post-page/post-page';
import InvitePage from './post-page/invite-page';
import TagFeedPage from './tag-feed-page/tag-feed-page';

import routes, { FEED, rootRoute, POST, REPLY, TAGS, INVITE } from '../routes';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const { logger } = props;
  const [, errorActions] = useErrors({ logger });
  const loginQuery = useGetLogin({ onError: errorActions.createError });

  const profileDataReq = useGetProfile(loginQuery.data?.pubKey);
  const loggedProfileData = profileDataReq.data;

  const showLoginModal = (redirectTo?: ModalNavigationOptions) => {
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
              navigateToUrl={props.singleSpa.navigateToUrl}
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
          <Route path={`${routes[REPLY]}/:postId`}>
            <div>Coming Soon!</div>
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
