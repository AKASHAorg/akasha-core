import React from 'react';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import routes, { EDIT } from '../../routes';
import { useTranslation } from 'react-i18next';
import { Profile, RootComponentProps, EntityTypes } from '@akashaorg/typings/ui';
import {
  ProfileHeader,
  ProfileBio,
  ProfileLinks,
} from '@akashaorg/design-system-components/lib/components/Profile';
import ProfileStatsPresentation from '../profile-stats-presentation';
import {
  useGetFollowingListByDidQuery,
  useUpdateFollowMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { getMediaUrl } from '@akashaorg/ui-awf-hooks';

type ProfileInfoPageProps = {
  profileId: string;
  isViewer: boolean;
  profileData: Profile;
};

const ProfileInfoPage: React.FC<RootComponentProps & ProfileInfoPageProps> = props => {
  const { profileId, isViewer, profileData, plugins } = props;

  const { t } = useTranslation('app-profile');

  const [showFeedback, setShowFeedback] = React.useState(false);

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const followingListReq = useGetFollowingListByDidQuery(
    { id: profileId },
    { select: resp => resp.node },
  );

  const updateFollowReq = useUpdateFollowMutation();

  const isFollowing =
    followingListReq.data && 'isViewer' in followingListReq.data
      ? followingListReq.data?.followList?.edges?.length > 0
      : false;

  const handleFollow = () => {
    if (profileId) {
      updateFollowReq.mutate({ i: { id: profileData.did.id, content: { isFollowing: true } } });
    }
  };

  const handleUnfollow = () => {
    updateFollowReq.mutate({ i: { id: profileData.did.id, content: { isFollowing: false } } });
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
    }, 5000);
  };

  const handleEntryFlag = (itemId: string, itemType: EntityTypes, user: string) => () => {
    if (!profileData?.did?.id) {
      return props.navigateToModal({
        name: 'login',
        redirectTo: { modal: { name: 'report-modal', itemId, itemType, user } },
      });
    }
    props.navigateToModal({ name: 'report-modal', itemId, itemType, user });
  };

  const background = profileData?.background
    ? {
        default: {
          ...profileData.background.default,
          src: getMediaUrl(profileData.background.default.src.replace(/(^\w+:|^)\/\//, ''))
            .originLink,
        },
      }
    : null;

  const avatar = profileData?.avatar
    ? {
        default: {
          ...profileData.avatar.default,
          src: getMediaUrl(profileData.avatar.default.src.replace(/(^\w+:|^)\/\//, '')).originLink,
        },
      }
    : null;

  return (
    <>
      <Stack direction="column" spacing="gap-y-4" fullWidth>
        <ProfileHeader
          did={profileData.did}
          background={background}
          avatar={avatar}
          name={profileData.name}
          ensName={null /*@TODO: integrate ENS when the API is ready */}
          isFollowing={isFollowing}
          viewerIsOwner={isViewer}
          flagLabel={t('Report')}
          handleUnfollow={handleUnfollow}
          handleFollow={handleFollow}
          handleFlag={handleEntryFlag(
            profileData.did.id ? profileData.did.id : '',
            EntityTypes.PROFILE,
            profileData.name,
          )}
          handleEdit={() => {
            navigateTo({
              appName: '@akashaorg/app-profile',
              getNavigationUrl: () => `/${profileId}${routes[EDIT]}`,
            });
          }}
        />
        {profileData.description && (
          <ProfileBio title={t('Bio')} biography={profileData.description} />
        )}
        <ProfileStatsPresentation profileId={profileId} navigateTo={navigateTo} />
        {profileData.links?.length > 0 && (
          <ProfileLinks
            title={t('Find me on')}
            links={profileData.links}
            copiedLabel={t('Copied')}
            copyLabel={t('Copy to clipboard')}
          />
        )}
        {showFeedback && isViewer && (
          <Snackbar
            title={t('You unfollowed {{name}}', { userName: profileData.name })}
            iconType="CheckCircleIcon"
            handleDismiss={() => {
              setShowFeedback(false);
            }}
            customStyle="mb-4"
          />
        )}
      </Stack>
    </>
  );
};

export default ProfileInfoPage;
