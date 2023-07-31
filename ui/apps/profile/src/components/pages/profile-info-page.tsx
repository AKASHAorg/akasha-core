import React from 'react';
import DefaultEmptyCard from '@akashaorg/design-system-components/lib/components/DefaultEmptyCard';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import FollowProfile from '../follow-profile';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import ProfileStatsPresentation from '../profile-stats-presentation';
import routes, { EDIT } from '../../routes';
import { useTranslation } from 'react-i18next';
import { RootComponentProps, EntityTypes } from '@akashaorg/typings/ui';
import {
  ProfileHeader,
  ProfileBio,
  ProfileLinks,
  ProfileLoading,
} from '@akashaorg/design-system-components/lib/components/Profile';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useParams } from 'react-router';
import { getProfileImageVersionsWithMediaUrl, useGetLogin } from '@akashaorg/ui-awf-hooks';
import getSDK from '@akashaorg/awf-sdk';
import { DIDDocument } from 'did-resolver';

const ProfileInfoPage: React.FC<RootComponentProps> = props => {
  const { plugins } = props;

  const { t } = useTranslation('app-profile');
  const sdk = getSDK();

  async function resolveDid(did: string): Promise<DIDDocument> {
    return await sdk.services.common.misc.resolveDID(did);
  }

  const [validDid, setValidDid] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const [showFeedback, setShowFeedback] = React.useState(false);

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const { profileId } = useParams<{ profileId: string }>();

  const loginQuery = useGetLogin();

  const profileDataReq = useGetProfileByDidQuery(
    {
      id: profileId,
    },
    {
      select: response => response.node,
      enabled: !!profileId,
    },
  );

  const status = profileDataReq.status;
  const { isViewer, profile: profileData } =
    profileDataReq.data && 'isViewer' in profileDataReq.data
      ? profileDataReq.data
      : { isViewer: null, profile: null };

  React.useEffect(() => {
    if (profileDataReq.data && !profileData) {
      setIsLoading(true);
      resolveDid(profileId).then(res => {
        setValidDid(Boolean(res));
        setIsLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileDataReq.data, profileId, profileData]);

  const isLoggedIn = !!loginQuery.data?.id;

  const hasProfile = status === 'success' && profileData;

  const profile = !hasProfile ? { id: profileId } : profileData.did;

  if (status === 'loading' || isLoading) return <ProfileLoading />;

  if (isLoggedIn && !profileData) {
    return navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}${routes[EDIT]}`,
    });
  }

  const hasError =
    status === 'error' ||
    (!hasProfile && !validDid); /*  || (status === 'success' && !profileData) */

  if (hasError)
    return (
      <ErrorLoader
        type="script-error"
        title={t('There was an error loading this profile')}
        details={t('We cannot show this profile right now')}
      />
    );

  const checkAuth = (cb: () => void) => () => {
    if (!isLoggedIn) {
      navigateTo({
        appName: '@akashaorg/app-auth-ewa',
        getNavigationUrl: navRoutes => navRoutes.CONNECT,
      });
      return;
    }
    cb();
  };

  const handleEntryFlag = (itemId: string, itemType: EntityTypes, user: string) => () => {
    props.navigateToModal({ name: 'report-modal', itemId, itemType, user });
  };

  const background = getProfileImageVersionsWithMediaUrl(profileData?.background);
  const avatar = getProfileImageVersionsWithMediaUrl(profileData?.avatar);

  return (
    <>
      <Stack direction="column" spacing="gap-y-4" fullWidth>
        <ProfileHeader
          did={profile}
          background={background}
          avatar={avatar}
          name={profileData?.name}
          ensName={null /*@TODO: integrate ENS when the API is ready */}
          viewerIsOwner={isViewer}
          flagLabel={t('Report')}
          copyLabel={t('Copy to clipboard')}
          copiedLabel={t('Copied')}
          followElement={
            <FollowProfile profileId={profileId} isIconButton={true} navigateTo={navigateTo} />
          }
          handleFlag={checkAuth(
            handleEntryFlag(
              profileData?.did.id ? profileData.did.id : '',
              EntityTypes.PROFILE,
              profileData?.name,
            ),
          )}
          handleEdit={() => {
            navigateTo({
              appName: '@akashaorg/app-profile',
              getNavigationUrl: () => `/${profileId}${routes[EDIT]}`,
            });
          }}
        />
        {profileData?.description && (
          <ProfileBio title={t('Bio')} biography={profileData.description} />
        )}
        {!hasProfile && (
          <DefaultEmptyCard
            infoText={t("It seems this user hasn't filled in their information just yet. 🤔")}
          />
        )}
        <ProfileStatsPresentation profileId={profileId} navigateTo={navigateTo} />
        {profileData?.links?.length > 0 && (
          <ProfileLinks
            title={t('Find me on')}
            links={profileData?.links}
            copiedLabel={t('Copied')}
            copyLabel={t('Copy to clipboard')}
          />
        )}
        {showFeedback && (
          <Snackbar
            title={t('You unfollowed {{name}}', { userName: profileData?.name })}
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
