import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ModalNavigationOptions, RootComponentProps } from '@akashaorg/typings/ui';

import FeedPage from './feed-page/feed-page';
import MyFeedPage from './my-feed-page/my-feed-page';
import ProfileFeedPage from './profile-feed-page/profile-feed-page';
import PostPage from './item-page/post-page';
import InvitePage from './item-page/invite-page';
import TagFeedPage from './tag-feed-page/tag-feed-page';

import routes, { FEED, MY_FEED, PROFILE_FEED, BEAM, REFLECT, TAGS, INVITE } from '../routes';
import ReplyPage from './item-page/reply-page';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const AppRoutes: React.FC<RootComponentProps> = props => {
  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.akashaProfile;
    },
  });
  const loggedProfileData = profileDataReq.data;

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    props.navigateToModal({ name: 'login', redirectTo });
  };

  return (
    <Router basename={props.baseRouteName}>
      <Stack>
        <Routes>
          <Route
            path={routes[FEED]}
            element={
              <FeedPage
                {...props}
                loggedProfileData={loggedProfileData}
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
                showLoginModal={showLoginModal}
              />
            }
          />
          <Route
            path={`${routes[BEAM]}/:postId`}
            element={<PostPage {...props} showLoginModal={showLoginModal} />}
          />
          <Route
            path={`${routes[TAGS]}/:tagName`}
            element={
              <TagFeedPage
                {...props}
                loggedProfileData={loggedProfileData}
                showLoginModal={showLoginModal}
              />
            }
          />
          <Route
            path={`${routes[PROFILE_FEED]}/:pubKey`}
            element={
              <ProfileFeedPage
                {...props}
                loggedProfileData={loggedProfileData}
                showLoginModal={showLoginModal}
              />
            }
          />
          <Route
            path={`${routes[REFLECT]}/:commentId`}
            element={<ReplyPage {...props} showLoginModal={showLoginModal} />}
          />
          <Route path={`${routes[INVITE]}/:inviteCode`} element={<InvitePage {...props} />} />
          <Route path="/" element={<Navigate to={routes[FEED]} replace />} />
        </Routes>
      </Stack>
    </Router>
  );
};

export default AppRoutes;
