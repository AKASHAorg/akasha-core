import * as React from 'react';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DS from '@akashaproject/design-system';

import routes, { FEED, rootRoute, POST, REPLY, TAGS, INVITE } from '../routes';
import FeedPage from './feed-page/feed-page';
import PostPage from './post-page/post-page';
import InvitePage from './post-page/invite-page';
import TagFeedPage from './tag-feed-page/tag-feed-page';
import { useLoginState, useErrors, useProfile } from '@akashaproject/ui-awf-hooks';

const { Box } = DS;
interface AppRoutesProps {
  onError: (err: IAkashaError) => void;
}
const AppRoutes: React.FC<RootComponentProps & AppRoutesProps> = props => {
  const { logger, onError } = props;

  const [, errorActions] = useErrors({ logger });

  const [loginState] = useLoginState({
    onError: errorActions.createError,
  });

  const [loginProfile, loginProfileActions] = useProfile({
    onError: errorActions.createError,
  });

  React.useEffect(() => {
    if (loginState.pubKey) {
      loginProfileActions.getProfileData({ pubKey: loginState.pubKey });
    }
  }, [loginState.pubKey]);

  const showLoginModal = () => {
    props.navigateToModal({ name: 'login' });
  };

  return (
    <Router>
      <Box>
        <Switch>
          <Route path={routes[FEED]}>
            <FeedPage
              {...props}
              loggedProfileData={loginProfile}
              loginState={loginState}
              showLoginModal={showLoginModal}
              onError={onError}
            />
          </Route>
          <Route path={`${routes[POST]}/:postId`}>
            <PostPage
              {...props}
              loginState={loginState}
              showLoginModal={showLoginModal}
              navigateToUrl={props.singleSpa.navigateToUrl}
              isMobile={props.isMobile}
              onError={onError}
            />
          </Route>
          <Route path={`${routes[TAGS]}/:tagName`}>
            <TagFeedPage
              {...props}
              loggedProfileData={loginProfile}
              loginState={loginState}
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
