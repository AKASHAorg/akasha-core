import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import FollowProfileButton from '../follow-profile-button';
import { AkashaProfile, IModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import { useGetProfileByIdQuery } from '@akashaorg/ui-core-hooks/lib/generated/apollo';
import { selectProfileData } from '@akashaorg/ui-core-hooks/lib/selectors/get-profile-by-id-query';
import { transformSource, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { cn } from '@akashaorg/ui/lib/library/utils';
import {
  ProfileAvatarButton,
  ProfileAvatarButtonAvatar,
  ProfileAvatarButtonAvatarFallback,
  ProfileAvatarButtonAvatarImage,
  ProfileDidField,
  ProfileName,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';

type EngagementsEntryProps = {
  profileID: string;
  profileDID: string;
  profileInfo?: AkashaProfile;
  authenticatedDID: string;
  showNsfw: boolean;
  profileAnchorLink: string;
  style?: React.CSSProperties;
  className?: string;
};

export const EngagementsEntry: React.FC<EngagementsEntryProps> = props => {
  const {
    profileID,
    profileDID,
    profileInfo,
    authenticatedDID,
    showNsfw,
    profileAnchorLink,
    style,
    className,
  } = props;
  const { getCorePlugins, navigateToModal } = useRootComponentProps();

  const { data } = useGetProfileByIdQuery({
    fetchPolicy: 'cache-and-network',
    variables: { id: profileID },
    skip: !!profileInfo,
  });

  const navigateTo = getCorePlugins().routing.navigateTo;

  const profileData = profileInfo ? profileInfo : selectProfileData(data);

  const onProfileClick = (profileDID: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${profileDID}`,
    });
  };

  const showLoginModal = (redirectTo?: { modal: IModalNavigationOptions }) => {
    navigateToModal({
      name: 'login',
      redirectTo,
    });
  };

  /*
   ** @todo
   ** if DID info isn't available in the current profile model then filter out entry info
   ** this could change in the future if getting this info becomes necessary
   **/
  const entryProfileDID = profileDID ?? profileData?.did?.id;

  const viewerIsOwner = authenticatedDID === entryProfileDID;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="between"
      style={style}
      className={cn('px-4 w-full', className)}
    >
      <a
        href={entryProfileDID ? `${profileAnchorLink}/${entryProfileDID}` : ''}
        rel="noreferrer noopener"
        onClick={event => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <ProfileAvatarButton
          profileDID={
            //@todo provide only the profile DID, if entryProfileDID is null then the entry info will be filtered out instead of displaying profile stream id
            entryProfileDID ?? profileID
          }
          onClick={() => {
            if (profileDID) onProfileClick(profileDID);
          }}
        >
          <ProfileAvatarButtonAvatar>
            <ProfileAvatarButtonAvatarImage
              src={transformSource(profileData?.avatar?.default)?.src}
              alt="Profile Avatar"
            />
            <ProfileAvatarButtonAvatarFallback
              alternativeSrc={profileData?.avatar?.alternatives?.map(
                alternative => transformSource(alternative)?.src,
              )}
            />
          </ProfileAvatarButtonAvatar>
          {profileData?.name && <ProfileName>{profileData?.name}</ProfileName>}
          <ProfileDidField />
        </ProfileAvatarButton>
      </a>
      {!viewerIsOwner && (
        <FollowProfileButton profileID={profileID} showLoginModal={showLoginModal} />
      )}
    </Stack>
  );
};
