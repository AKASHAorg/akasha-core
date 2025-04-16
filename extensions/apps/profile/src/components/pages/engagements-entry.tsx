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
      {
        // href={entryProfileDID ? `${profileAnchorLink}/${entryProfileDID}` : ''}
      }
      <ProfileAvatarButton
        profileDID={entryProfileDID ?? profileID}
        {...(profileData?.nsfw && {
          nsfw: !(viewerIsOwner || showNsfw),
          nsfwLabel: 'NSFW',
        })}
        onClick={() => {
          if (profileDID) onProfileClick(profileDID);
        }}
      >
        <ProfileAvatarButtonAvatar>
          <ProfileAvatarButtonAvatarImage
            src={
              transformSource(profileData?.avatar?.default)?.src ||
              profileData?.avatar?.alternatives?.map(alternative =>
                transformSource(alternative),
              )?.[0]?.src
            }
            alt="@akashaorg"
          />
          <ProfileAvatarButtonAvatarFallback />
        </ProfileAvatarButtonAvatar>
        <ProfileName>{profileData?.name}</ProfileName>
        <ProfileDidField />
      </ProfileAvatarButton>
      {!viewerIsOwner && (
        <FollowProfileButton profileID={profileID} showLoginModal={showLoginModal} />
      )}
    </Stack>
  );
};
