import * as React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import FeedPage from './feed-page/feed-page';
import MyFeedPage from './my-feed-page/my-feed-page';
import ProfileFeedPage from './profile-feed-page/profile-feed-page';
import BeamPage from './item-page/beam-page';
import ReflectPage from './item-page/reflect-page';
import InvitePage from './item-page/invite-page';
import TagFeedPage from './tag-feed-page/tag-feed-page';
import routes, { FEED, MY_FEED, PROFILE_FEED, BEAM, REFLECT, TAGS, INVITE } from '../routes';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { Extension } from '@akashaorg/ui-lib-extensions/lib/react/extension';

const AppRoutes: React.FC<unknown> = () => {
  const { baseRouteName } = useRootComponentProps();
  const [activeModal, setActiveModal] = React.useState<{
    name: string;
    modalData: Record<string, unknown>;
  }>(null);

  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.akashaProfile;
    },
  });

  const loggedProfileData = profileDataReq.data;

  // const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
  //   navigateToModal({ name: 'login', redirectTo });
  // };

  const showModal = React.useCallback((name: string, modalData: Record<string, unknown>) => {
    setActiveModal({
      name,
      modalData,
    });
  }, []);

  return (
    <Router basename={baseRouteName}>
      <Stack>
        {activeModal && (
          <Extension isModal={true} name={activeModal.name} extensionData={activeModal.modalData} />
        )}
        <Routes>
          <Route
            path={routes[FEED]}
            element={<FeedPage loggedProfileData={loggedProfileData} showModal={showModal} />}
          />
          <Route
            path={routes[MY_FEED]}
            element={<MyFeedPage loggedProfileData={loggedProfileData} showModal={showModal} />}
          />
          <Route path={`${routes[BEAM]}/:beamId`} element={<BeamPage />} />
          <Route
            path={`${routes[TAGS]}/:tagName`}
            element={<TagFeedPage loggedProfileData={loggedProfileData} showModal={showModal} />}
          />
          <Route
            path={`${routes[PROFILE_FEED]}/:did`}
            element={
              <ProfileFeedPage loggedProfileData={loggedProfileData} showModal={showModal} />
            }
          />
          <Route path={`${routes[REFLECT]}/:reflectId`} element={<ReflectPage />} />
          <Route path={`${routes[INVITE]}/:inviteCode`} element={<InvitePage />} />
          <Route path="/" element={<Navigate to={routes[FEED]} replace />} />
        </Routes>
      </Stack>
    </Router>
  );
};

export default AppRoutes;
