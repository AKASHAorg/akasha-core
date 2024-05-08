import React, { useMemo } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import TrendingWidgetItemLoader from '@akashaorg/design-system-components/lib/components/TrendingWidgetLoadingCard/trending-widget-item-loader';
import { FollowList, RootComponentProps } from '@akashaorg/typings/lib/ui';
import { hasOwn, transformSource } from '@akashaorg/ui-awf-hooks';
import { Extension } from '@akashaorg/ui-lib-extensions/lib/react/extension';
import { useGetProfileByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

export type LatestProfilesProps = {
  // data
  profileID: string;
  followList?: FollowList;
  authenticatedDID?: string | null;
  isLoggedIn: boolean;
  uiEvents: RootComponentProps['uiEvents'];
  // handlers
  onClickProfile: (did: string) => void;
};

export const LatestProfiles: React.FC<LatestProfilesProps> = props => {
  const { onClickProfile, profileID, followList, isLoggedIn, authenticatedDID } = props;

  const profileReq = useGetProfileByIdQuery({ variables: { id: profileID } });

  const profileData = useMemo(() => {
    if (profileReq.data?.node && hasOwn(profileReq.data.node, 'id')) {
      return profileReq.data.node;
    }
    return null;
  }, [profileReq.data?.node]);

  if (profileReq.loading) return <TrendingWidgetItemLoader />;

  return (
    profileData && (
      <Stack
        key={profileData.id}
        direction="row"
        align="center"
        justify="between"
        spacing="gap-x-3"
        customStyle="w-(full xl:[19rem])"
      >
        <ProfileAvatarButton
          profileId={profileData.did.id}
          label={profileData.name}
          avatar={transformSource(profileData?.avatar?.default)}
          alternativeAvatars={profileData?.avatar?.alternatives?.map(alternative =>
            transformSource(alternative),
          )}
          onClick={() => onClickProfile(profileData.did.id)}
        />

        {authenticatedDID !== profileData.did.id && (
          <Extension
            name={`follow_${profileData.id}`}
            extensionData={{
              profileID: profileData.id,
              isFollowing: followList?.get(profileData.id)?.isFollowing,
              isLoggedIn,
              followId: followList?.get(profileData.id)?.id,
            }}
          />
        )}
      </Stack>
    )
  );
};
