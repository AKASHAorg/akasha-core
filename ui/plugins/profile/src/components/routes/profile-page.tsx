import * as React from 'react';
import { ProfilePageCard } from '../profile-cards/profile-card';
import DS from '@akashaproject/design-system';
import { useErrors, usePosts, useProfile } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/src';
import { useParams } from 'react-router-dom';
import {
  ModalState,
  ModalStateActions,
  MODAL_NAMES,
} from '@akashaproject/ui-awf-hooks/lib/use-modal-state';

import FeedWidget, { ItemTypes } from '@akashaproject/ui-widget-feed/lib/components/App';
import { ILoadItemsPayload } from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/Cards/entry-cards/entry-box';

const { Box, Helmet } = DS;
export interface ProfilePageProps extends RootComponentProps {
  modalActions: ModalStateActions;
  modalState: ModalState;
  ethAddress: string | null;
  onLogin: any;
  loggedProfileData: any;
}

const ProfilePage = (props: ProfilePageProps) => {
  const { ethAddress } = props;

  const { pubKey } = useParams() as any;
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
    onError: errorActions.createError,
    user: ethAddress,
  });

  React.useEffect(() => {
    if (pubKey) {
      profileActions.getProfileData({ pubKey });
    }
  }, [pubKey]);

  const handleLoadMore = (payload: ILoadItemsPayload) => {
    const req: { limit: number; offset?: string } = {
      limit: payload.limit,
    };
    if (!postsState.isFetchingPosts) {
      postsActions.getUserPosts({ pubKey, ...req });
    }
  };

  const handleItemDataLoad = ({ itemId }: { itemId: string }) => {
    postsActions.getPost(itemId);
  };

  const handleNavigation = (itemType: ItemTypes, details: IContentClickDetails) => {
    let url;
    switch (itemType) {
      case ItemTypes.PROFILE:
        url = `/profile/${details.entryId}`;
        postsActions.resetPostIds();
        profileActions.resetProfileData();
        break;
      case ItemTypes.ENTRY:
        url = `/AKASHA-app/post/${details.entryId}`;
        break;
      case ItemTypes.COMMENT:
        /* Navigate to parent post because we don't have the comment page yet */
        const parentId = postsState.postsData[details.entryId].postId;
        url = `/AKASHA-app/post/${parentId}`;
        break;
      default:
        break;
    }
    props.singleSpa.navigateToUrl(url);
  };

  const handleLoginModalOpen = () => {
    props.modalActions.show(MODAL_NAMES.LOGIN);
  };

  const handleRepostPublish = (entryData: any, embedEntry: any) => {
    postsActions.optimisticPublishPost(entryData, props.loggedProfileData, embedEntry, true);
  };

  const profileUserName = React.useMemo(() => {
    if (profileState.name) {
      return profileState.name;
    }
    if (profileState.ensName) {
      return profileState.ensName;
    }
    return pubKey;
  }, [profileState, pubKey]);

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Profile | {`${profileUserName}`}'s Page</title>
      </Helmet>
      <ProfilePageCard
        {...props}
        profileData={profileState}
        profileId={pubKey}
        loggedUserEthAddress={ethAddress}
        modalActions={props.modalActions}
        modalState={props.modalState}
      />
      <FeedWidget
        // pass i18n from props (the i18next instance, not the react one!)
        i18n={props.i18n}
        itemType={ItemTypes.ENTRY}
        logger={props.logger}
        loadMore={handleLoadMore}
        loadItemData={handleItemDataLoad}
        getShareUrl={(itemId: string) => `${window.location.origin}/AKASHA-app/post/${itemId}`}
        itemIds={postsState.postIds}
        itemsData={postsState.postsData}
        errors={errorState}
        sdkModules={props.sdkModules}
        layout={props.layout}
        globalChannel={props.globalChannel}
        ethAddress={ethAddress}
        onNavigate={handleNavigation}
        onLoginModalOpen={handleLoginModalOpen}
        totalItems={postsState.totalItems}
        profilePubKey={pubKey}
        modalSlotId={props.layout.app.modalSlotId}
        loggedProfile={props.loggedProfileData}
        onRepostPublish={handleRepostPublish}
      />
    </Box>
  );
};

export default ProfilePage;
