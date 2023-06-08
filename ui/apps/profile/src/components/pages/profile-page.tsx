import React from 'react';
import ProfileInfoPage from './profile-info-page';
import EditProfilePage from './edit-profile';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Helmet from '@akashaorg/design-system-core/lib/components/Helmet';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useParams } from 'react-router';
import { ProfileLoading } from '@akashaorg/design-system-components/lib/components/Profile';

type ProfilePageProps = {
  editMode?: boolean;
};

const ProfilePage = (props: RootComponentProps & ProfilePageProps) => {
  const { t } = useTranslation('app-profile');

  const { profileId } = useParams<{ profileId: string }>();

  const profileDataReq = useGetProfileByDidQuery(
    {
      id: profileId,
    },
    {
      select: response => response.node,
    },
  );

  const status = profileDataReq.status;

  const { isViewer, profile: profileData } =
    profileDataReq.data && 'isViewer' in profileDataReq.data
      ? profileDataReq.data
      : { isViewer: null, profile: null };

  const hasError = status === 'error' || (status === 'success' && !profileData);

  if (hasError)
    return (
      <ErrorLoader
        type="script-error"
        title={t('There was an error loading this profile')}
        details={t('We cannot show this profile right now')}
      />
    );

  if (status === 'loading') return <ProfileLoading />;

  return (
    <>
      <Helmet>
        <title>{t("{{name}}'s Page", { name: `${profileData.name}` })} | AKASHA World</title>
      </Helmet>
      {props.editMode ? (
        <EditProfilePage
          profileId={profileId}
          profileData={profileData}
          isViewer={isViewer}
          {...props}
        />
      ) : (
        <ProfileInfoPage
          profileId={profileId}
          profileData={profileData}
          isViewer={isViewer}
          {...props}
        />
      )}
    </>
  );
};

export default ProfilePage;
