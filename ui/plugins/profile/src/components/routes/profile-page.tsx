import * as React from 'react';
import { ProfilePageCard } from '../profile-cards/profile-card';
import DS from '@akashaproject/design-system';
import { useErrors, usePosts, useProfile } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/src';
import { useParams } from 'react-router-dom';
import { ModalState, ModalStateActions } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';

import FeedWidget, { ItemTypes } from '@akashaproject/ui-widget-feed/lib/components/App';

const { Box, Helmet } = DS;
export interface ProfilePageProps extends RootComponentProps {
  modalActions: ModalStateActions;
  modalState: ModalState;
  ethAddress: string | null;
  onLogin: any;
}

const ProfilePage = (props: ProfilePageProps) => {
  const { ethAddress } = props;

  const { profileId } = useParams() as any;
  const [errorState, errorActions] = useErrors({
    logger: props.logger,
  });
  const [profileState, profileActions] = useProfile({
    onError: errorActions.createError,
    ipfsService: props.sdkModules.commons.ipfsService,
    profileService: props.sdkModules.profiles.profileService,
  });

  const [postsState, postsActions] = usePosts({
    postsService: props.sdkModules.posts,
    ipfsService: props.sdkModules.commons.ipfsService,
    profileService: props.sdkModules.profiles.profileService,
    onError: errorActions.createError,
  });

  React.useEffect(() => {
    if (profileId) {
      profileActions.getProfileData({ ethAddress: profileId });
    }
  }, [profileId]);

  const handleLoadMore = () => {
    console.log('loading more for eth:', profileId);
    postsActions.getUserPosts(profileId);
  };

  const handleItemDataLoad = ({ itemId }: { itemId: string }) => {
    return postsState.postsData[itemId];
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Profile | {profileId} Page</title>
      </Helmet>
      <ProfilePageCard
        {...props}
        profileData={profileState}
        profileId={profileId}
        loggedUserEthAddress={ethAddress}
        modalActions={props.modalActions}
        modalState={props.modalState}
      />
      <FeedWidget
        i18n={props.i18n}
        itemType={ItemTypes.ENTRY}
        logger={props.logger}
        loadMore={handleLoadMore}
        loadItemData={handleItemDataLoad}
        itemIds={postsState.postIds}
        itemsData={postsState.postsData}
        errors={errorState}
        sdkModules={props.sdkModules}
        layout={props.layout}
        globalChannel={props.globalChannel}
      />
    </Box>
  );
};

export default ProfilePage;
