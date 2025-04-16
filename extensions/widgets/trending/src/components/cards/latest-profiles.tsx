import React, { useMemo } from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import TrendingWidgetItemLoader from '@akashaorg/design-system-components/lib/components/TrendingWidgetLoadingCard/trending-widget-item-loader';
import { IRootComponentProps } from '@akashaorg/typings/lib/ui';
import { hasOwn, transformSource, useNsfwToggling } from '@akashaorg/ui-core-hooks';
import { Extension } from '@akashaorg/ui-lib-extensions/lib/react/extension';
import { useGetProfileByIdQuery } from '@akashaorg/ui-core-hooks/lib/generated/apollo';
import {
  ProfileAvatarButton,
  ProfileAvatarButtonAvatar,
  ProfileAvatarButtonAvatarFallback,
  ProfileAvatarButtonAvatarImage,
  ProfileDidField,
  ProfileName,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';

export type LatestProfilesProps = {
  // data
  profileID: string;
  authenticatedDID?: string | null;
  uiEvents: IRootComponentProps['uiEvents'];
  // handlers
  onClickProfile: (did: string) => void;
};

export const LatestProfiles: React.FC<LatestProfilesProps> = props => {
  const { onClickProfile, profileID, authenticatedDID } = props;

  const profileReq = useGetProfileByIdQuery({ variables: { id: profileID } });

  const profileData = useMemo(() => {
    if (profileReq.data?.node && hasOwn(profileReq.data.node, 'id')) {
      return profileReq.data.node;
    }
    return null;
  }, [profileReq.data?.node]);

  const { showNsfw } = useNsfwToggling();

  const isViewer = authenticatedDID === profileData?.did?.id;

  if (profileReq.loading) return <TrendingWidgetItemLoader />;

  return (
    profileData && (
      <Stack
        key={profileData.id}
        direction="row"
        alignItems="center"
        justifyContent="between"
        spacing={3}
        className="w-(full xl:[19rem])"
      >
        <ProfileAvatarButton
          profileDID={profileData.did.id}
          onClick={() => onClickProfile(profileData.did.id)}
          {...(profileData.nsfw && { nsfwLabel: 'NSFW', nsfw: !(isViewer || showNsfw) })}
        >
          <ProfileAvatarButtonAvatar>
            <ProfileAvatarButtonAvatarImage
              src={
                transformSource(profileData?.avatar?.default)?.src ||
                profileData?.avatar?.alternatives?.map(alternative =>
                  transformSource(alternative),
                )?.[0]?.src
              }
              alt="Contributor Avatar"
            />
            <ProfileAvatarButtonAvatarFallback />
          </ProfileAvatarButtonAvatar>
          <ProfileName className="text-[0.75rem] leading-[1.125rem]">
            {profileData.name}
          </ProfileName>
          <ProfileDidField />
        </ProfileAvatarButton>

        {!isViewer && (
          <Extension
            name={`follow_${profileData.id}`}
            extensionData={{
              profileID: profileData.id,
            }}
          />
        )}
      </Stack>
    )
  );
};
