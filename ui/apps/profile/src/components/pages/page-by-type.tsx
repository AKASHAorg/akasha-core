import React from 'react';
import ProfileEngagementsPage from './profile-engagement';
import EditProfilePage from './edit-profile';
import ProfilePage from './profile';
import DS from '@akashaorg/design-system';
import { Profile, RootComponentProps } from '@akashaorg/typings/ui';
import { ProfileLoading } from '@akashaorg/design-system-components/lib/components/Profile';
import { ProfileEngagementLoading } from '@akashaorg/design-system-components/lib/components/ProfileEngagements/placeholders/ProfileEngagementLoading';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { EntryCardHidden, ProfileDelistedCard } = DS;

export type PageType = 'engagement' | 'edit';

type PageByTypeProps = {
  profileData: Profile;
  loggedProfileData: Profile;
  isLoading: boolean;
  pageType?: PageType;
  onCTAClick?: () => void;
};
const PageByType: React.FC<RootComponentProps & PageByTypeProps> = ({
  profileData,
  loggedProfileData,
  isLoading,
  pageType,
  onCTAClick,
  ...rest
}) => {
  const { t } = useTranslation('app-profile');
  const { profileId } = useParams<{
    profileId: string;
  }>();
  const [params] = useSearchParams();
  const tab = params.get('tab');
  const selectedStat = tab === 'followers' || tab === 'following' ? tab : 'followers';

  const navigateTo = rest.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  if (isLoading) {
    if (pageType === 'engagement') return <ProfileEngagementLoading />;
    return <ProfileLoading />;
  }
  // @TODO fix when we have new moderation api
  // if (profileData.moderated && profileData.delisted) {
  //   return (
  //     <>
  //       <EntryCardHidden
  //         isDelisted={profileData.delisted}
  //         delistedAccount={profileData.delisted}
  //         moderatedContentLabel={t('This account was suspended for violating the')}
  //         ctaLabel={t('Code of Conduct')}
  //         // @TODO: fix navigation for cta: check moderation intro card
  //         ctaUrl="/code-of-conduct"
  //         onCTAClick={onCTAClick}
  //       />
  //       <ProfileDelistedCard name={t('Suspended Account')} userName={profileData.userName || ''} />
  //     </>
  //   );
  // }
  // if (!profileData.moderated && profileData.reported) {
  //   return (
  //     <EntryCardHidden
  //       reportedAccount={profileData.reported}
  //       reason={profileData.reason}
  //       headerTextLabel={t('You reported this account for the following reason')}
  //       footerTextLabel={t('It is awaiting moderation.')}
  //     />
  //   );
  // }

  // if (!profileData.delisted) {
  if (pageType === 'engagement') {
    return (
      <ProfileEngagementsPage
        {...rest}
        selectedStat={selectedStat}
        loggedProfileData={loggedProfileData}
        profileData={profileData}
      />
    );
  }

  if (pageType === 'edit') {
    if (!loggedProfileData.did.isViewer) {
      navigateTo({
        appName: '@akashaorg/app-profile',
        getNavigationUrl: () => `/${profileId}`,
      });
    }
    return (
      <EditProfilePage {...rest} loggedProfileData={loggedProfileData} profileData={profileData} />
    );
  }

  return (
    <ProfilePage
      {...rest}
      profileData={profileData}
      profileId={profileId}
      loggedProfileData={loggedProfileData}
    />
  );
};
// return null;
// };
export default PageByType;
