import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DS from '@akashaorg/design-system';
import { useGetLogin, useGetProfile } from '@akashaorg/ui-awf-hooks';
import { ModalNavigationOptions, RootComponentProps } from '@akashaorg/typings/ui';

import FeedPage from './feed-page/feed-page';
import MyFeedPage from './my-feed-page/my-feed-page';
import PostPage from './post-page/post-page';
import InvitePage from './post-page/invite-page';
import TagFeedPage from './tag-feed-page/tag-feed-page';

import routes, { FEED, MY_FEED, POST, REPLY, TAGS, INVITE } from '../routes';
import ReplyPage from './post-page/reply-page';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const loginQuery = useGetLogin();

  const profileDataReq = useGetProfile(loginQuery.data?.pubKey);
  /* @Todo: fix my type ;/ */
  const loggedProfileData: any = profileDataReq.data;

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    props.navigateToModal({ name: 'login', redirectTo });
  };

  return (
    <Router basename={props.baseRouteName}>
      <Box>
        <Routes>
          <Route
            path={routes[FEED]}
            element={
              <FeedPage
                {...props}
                loggedProfileData={loggedProfileData}
                loginState={loginQuery.data}
                showLoginModal={showLoginModal}
              />
            }
          />
          <Route
            path={routes[MY_FEED]}
            element={
              <MyFeedPage
                {...props}
                loggedProfileData={loggedProfileData}
                loginState={loginQuery.data}
                showLoginModal={showLoginModal}
              />
            }
          />
          <Route
            path={`${routes[POST]}/:postId`}
            element={
              <PostPage {...props} loginState={loginQuery.data} showLoginModal={showLoginModal} />
            }
          />
          <Route
            path={`${routes[TAGS]}/:tagName`}
            element={
              <TagFeedPage
                {...props}
                loggedProfileData={loggedProfileData}
                loginState={loginQuery.data}
                showLoginModal={showLoginModal}
              />
            }
          />
          <Route
            path={`${routes[REPLY]}/:commentId`}
            element={
              <ReplyPage {...props} loginState={loginQuery.data} showLoginModal={showLoginModal} />
            }
          />
          <Route path={`${routes[INVITE]}/:inviteCode`} element={<InvitePage {...props} />} />
          <Route path="/" element={<Navigate to={routes[FEED]} replace />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default AppRoutes;
