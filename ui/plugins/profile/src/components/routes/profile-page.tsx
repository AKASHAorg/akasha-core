import * as React from 'react';
import { ProfilePageHeader } from '../ProfileHeader/profile-header';
import DS from '@akashaproject/design-system';
import { useProfile } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/src';
import { useParams } from 'react-router-dom';

export interface ProfilePageProps {
  modalOpen: boolean;
  ethAddress?: string;
  onLogin: (param: 1 | 2) => void;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showLoginModal: () => void;
}

const ProfilePage = (props: RootComponentProps & ProfilePageProps) => {
  const { modalOpen, ethAddress, setModalOpen, showLoginModal } = props;

  const { profileId } = useParams() as any;
  const [profileState, profileActions] = useProfile({
    onError: err => {
      console.log(err);
    },
    sdkModules: props.sdkModules,
  });

  React.useEffect(() => {
    if (profileId) {
      profileActions.getProfileData({ ethAddress: profileId });
    }
  }, [profileId]);

  return (
    <div>
      <DS.Helmet>
        <title>Profile | {profileId} Page</title>
      </DS.Helmet>
      <ProfilePageHeader
        {...props}
        profileData={profileState}
        profileId={profileId}
        modalOpen={modalOpen}
        loggedUserEthAddress={ethAddress}
        setModalOpen={setModalOpen}
        showLoginModal={showLoginModal}
      />
    </div>
  );
};

export default ProfilePage;
