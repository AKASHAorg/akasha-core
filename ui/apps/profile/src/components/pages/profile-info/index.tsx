import React from 'react';
import DefaultEmptyCard from '@akashaorg/design-system-components/lib/components/DefaultEmptyCard';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ProfileStatsPresentation from '../../profile-stats-presentation';
import ProfileNotFound from '@akashaorg/design-system-components/lib/components/ProfileNotFound';
import routes, { EDIT } from '../../../routes';
import IconButtonFollow from '../../icon-button-follow/icon-button-follow';
import {
  ProfileHeader,
  ProfileBio,
  ProfileLinks,
  ProfileLoading,
} from '@akashaorg/design-system-components/lib/components/Profile';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { RootComponentProps, EntityTypes, ModalNavigationOptions } from '@akashaorg/typings/ui';
import {
  getProfileImageVersionsWithMediaUrl,
  useGetLogin,
  useValidDid,
} from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { MenuProps } from '@akashaorg/design-system-core/lib/components/Menu';

export interface ProfilePageProps {
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
}

const ProfileInfoPage: React.FC<RootComponentProps & ProfilePageProps> = props => {
  const { plugins, navigateToModal, showLoginModal } = props;

  const { t } = useTranslation('app-profile');
  const { profileId } = useParams<{ profileId: string }>();
  const [showFeedback, setShowFeedback] = React.useState(false);
  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;
  const loginQuery = useGetLogin();

  const isLoggedIn = React.useMemo(() => {
    return !!loginQuery.data?.id;
  }, [loginQuery.data]);

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

  const handleFlag = React.useCallback(
    (itemId: string, itemType: EntityTypes, user: string) => () => {
      if (!isLoggedIn) {
        return showLoginModal({ modal: { name: 'report-modal', itemId, itemType, user } });
      }
      navigateToModal({ name: 'report-modal', itemId, itemType, user });
    },
    [isLoggedIn],
  );
  const { isViewer, akashaProfile: profileData } = Object.assign(
    { isViewer: null, akashaProfile: null },
    profileDataReq.data,
  );

  const { validDid, isLoading, isEthAddress } = useValidDid(
    profileId,
    profileDataReq.data && !profileData,
  );
  const hasProfile = status === 'success' && profileData;
  const did = !hasProfile ? { id: profileId } : profileData.did;

  if (status === 'loading' || isLoading) return <ProfileLoading />;

  const goToHomepage = () => {
    navigateTo({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => navRoutes.defaultRoute,
    });
  };

  const goEditProfile = () => {
    return navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}${routes[EDIT]}`,
    });
  };

  if (status === 'error')
    return (
      <ErrorLoader
        type="script-error"
        title={t('There was an error loading this profile')}
        details={t('We cannot show this profile right now')}
      />
    );

  const background = getProfileImageVersionsWithMediaUrl(profileData?.background);
  const avatar = getProfileImageVersionsWithMediaUrl(profileData?.avatar);

  if (!hasProfile && !validDid)
    return (
      <ProfileNotFound
        titleLabel={t('This profile doesn’t exist')}
        buttonLabel={t('Go back home')}
        onClickGoToHomepage={goToHomepage}
      />
    );

  const handleCopy = () => {
    const profileUrl = new URL(location.pathname, location.origin).href;

    navigator.clipboard.writeText(profileUrl).then(() => {
      setShowFeedback(true);
    });
  };

  const handleEdit = () => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}${routes[EDIT]}`,
    });
  };

  const menuItems: MenuProps['items'] = [
    {
      label: t('Copy link'),
      icon: 'LinkIcon',
      onClick: handleCopy,
    },
    ...(!isViewer
      ? ([
          {
            label: t('Report'),
            icon: 'FlagIcon',
            onClick: handleFlag(profileData?.did.id, EntityTypes.PROFILE, profileData?.name),
            color: { light: 'errorLight', dark: 'errorDark' },
          },
        ] as MenuProps['items'])
      : []),
  ];

  return (
    <>
      <Stack direction="column" spacing="gap-y-4" fullWidth>
        <ProfileHeader
          did={did}
          validAddress={hasProfile ? true : isEthAddress ?? validDid}
          background={background}
          avatar={avatar}
          name={profileData?.name}
          ensName={null /*@TODO: integrate ENS when the API is ready */}
          viewerIsOwner={isViewer}
          menuItems={menuItems}
          copyLabel={t('Copy to clipboard')}
          copiedLabel={t('Copied')}
          publicImagePath="/images"
          followElement={
            <IconButtonFollow
              profileId={profileId}
              profileStreamId={profileData?.id}
              showLoginModal={showLoginModal}
            />
          }
          handleEdit={handleEdit}
        />
        {profileData?.description && (
          <ProfileBio title={t('Bio')} biography={profileData.description} />
        )}
        {!isLoggedIn && !hasProfile && (
          <DefaultEmptyCard
            infoText={t("It seems this user hasn't filled in their information just yet. 🤔")}
            customCardSize={{ width: '140px', height: '85px' }}
          />
        )}

        {isLoggedIn && !profileData && (
          <DefaultEmptyCard
            infoText={t('Uh-uh! it looks like you haven’t filled your information!')}
            buttonLabel={t('Fill my info')}
            buttonClickHandler={goEditProfile}
          />
        )}
        <ProfileStatsPresentation
          profileId={profileId}
          navigateTo={navigateTo}
          showLoginModal={() => showLoginModal({ modal: { name: location.pathname } })}
        />
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
            title={`${t('Profile link copied')}!`}
            type="success"
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
