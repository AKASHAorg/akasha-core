import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import FeedPage from './feed-page/feed-page';
import MyFeedPage from './my-feed-page/my-feed-page';
import ProfileFeedPage from './profile-feed-page/profile-feed-page';
import EditorPage from './editor-page/editor-page';
import PostPage from './item-page/post-page';
import InvitePage from './item-page/invite-page';
import TagFeedPage from './tag-feed-page/tag-feed-page';

import routes, {
  FEED,
  MY_FEED,
  PROFILE_FEED,
  BEAM,
  EDITOR,
  REFLECT,
  TAGS,
  INVITE,
} from '../routes';
import ReplyPage from './item-page/reply-page';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName, navigateToModal } = useRootComponentProps();

  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.akashaProfile;
    },
  });
  const loggedProfileData = profileDataReq.data;

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    navigateToModal({ name: 'login', redirectTo });
  };

  return (
    <Router basename={baseRouteName}>
      <Stack>
        <Routes>
          <Route
            path={routes[FEED]}
            element={
              <FeedPage loggedProfileData={loggedProfileData} showLoginModal={showLoginModal} />
            }
          />
          <Route
            path={routes[MY_FEED]}
            element={
              <MyFeedPage loggedProfileData={loggedProfileData} showLoginModal={showLoginModal} />
            }
          />
          <Route
            path={routes[EDITOR]}
            element={<EditorPage loggedProfileData={loggedProfileData} />}
          />
          <Route
            path={`${routes[BEAM]}/:postId`}
            element={<PostPage showLoginModal={showLoginModal} />}
          />
          <Route
            path={`${routes[TAGS]}/:tagName`}
            element={
              <TagFeedPage loggedProfileData={loggedProfileData} showLoginModal={showLoginModal} />
            }
          />
          <Route
            path={`${routes[PROFILE_FEED]}/:did`}
            element={
              <ProfileFeedPage
                loggedProfileData={loggedProfileData}
                showLoginModal={showLoginModal}
              />
            }
          />
          <Route
            path={`${routes[REFLECT]}/:commentId`}
            element={<ReplyPage showLoginModal={showLoginModal} />}
          />
          <Route path={`${routes[INVITE]}/:inviteCode`} element={<InvitePage />} />
          <Route path="/" element={<Navigate to={routes[FEED]} replace />} />
        </Routes>
      </Stack>
    </Router>
  );
};

export default AppRoutes;
