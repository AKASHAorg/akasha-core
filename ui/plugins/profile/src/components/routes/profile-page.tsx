import * as React from 'react';
import { ProfilePageCard } from '../profile-cards/profile-card';
import DS from '@akashaproject/design-system';
import { useProfile } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/src';
import { useParams } from 'react-router-dom';
import { ModalState, ModalStateActions } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';

export interface ProfilePageProps extends RootComponentProps {
  modalActions: ModalStateActions;
  modalState: ModalState
  ethAddress: string | null;
  onLogin: any;
}

const ProfilePage = (props: ProfilePageProps) => {
  const { ethAddress } = props;

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
      <ProfilePageCard
        {...props}
        profileData={profileState}
        profileId={profileId}
        loggedUserEthAddress={ethAddress}
        modalActions={props.modalActions}
        modalState={props.modalState}
      />
    </div>
  );
};

export default ProfilePage;
