import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';

import DS from '@akashaorg/design-system';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { ProfileLoading } from '@akashaorg/design-system-core/lib/components/ProfileCard';
import { ProfileStatLoading } from '@akashaorg/design-system-core/lib/components/ProfileStatLists/placeholders/ProfileStatLoading';

import { RootComponentProps, IProfileData, ProfileStatType } from '@akashaorg/typings/ui';
import { useGetProfile, LoginState, useGetLogin } from '@akashaorg/ui-awf-hooks';

import menuRoute, { MY_PROFILE } from '../../routes';
import ProfileCards from '../profile-cards';
import ProfileStatPage from '../profile-cards/profile-stat-page';

const { Box, Helmet, EntryCardHidden, ProfileDelistedCard } = DS;

export interface ProfilePageProps extends RootComponentProps {
  loggedProfileData: IProfileData;
  loginState: LoginState;
  showStat?: boolean;
}

const ProfilePage = (props: ProfilePageProps) => {
  const { plugins, loggedProfileData, showStat } = props;

  const { t } = useTranslation('app-profile');
  const location = useLocation();
  const { pubKey, tab: selectedStat } = useParams<{
    pubKey: string;
    tab?: ProfileStatType;
  }>();

  const routing = plugins['@akashaorg/app-routing']?.routing;

  const publicKey = React.useMemo(() => {
    if (location.pathname.includes(menuRoute[MY_PROFILE])) {
      if (loggedProfileData && loggedProfileData.pubKey) {
        return loggedProfileData.pubKey;
      }
      return undefined;
    }
    return pubKey;
  }, [pubKey, loggedProfileData, location.pathname]);

  const loginQuery = useGetLogin();

  const profileDataQuery = useGetProfile(
    publicKey,
    loginQuery.data?.pubKey,
    loginQuery.data?.fromCache,
  );

  const profileState = profileDataQuery.data;

  const profileUserName = React.useMemo(() => {
    if (profileState && profileState.name) {
      return profileState.name;
    }
    return pubKey;
  }, [profileState, pubKey]);

  const handleCTAClick = () => {
    routing.navigateTo({
      appName: '@akashaorg/app-legal',
      getNavigationUrl: () => '/legal/code-of-conduct',
    });
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>
          {t("{{profileUsername}}'s Page", { profileUsername: profileUserName || '' })} | Ethereum
          World
        </title>
      </Helmet>
      {(profileDataQuery.status === 'loading' || profileDataQuery.status === 'idle') &&
        (showStat ? <ProfileStatLoading /> : <ProfileLoading />)}
      {(profileDataQuery.status === 'error' ||
        (profileDataQuery.status === 'success' && !profileState)) && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading this profile')}
          details={t('We cannot show this profile right now')}
          devDetails={profileDataQuery.error?.message}
        />
      )}
      {profileDataQuery.status === 'success' && profileState && (
        <>
          {profileState.moderated && profileState.delisted && (
            <EntryCardHidden
              isDelisted={profileState.delisted}
              delistedAccount={profileState.delisted}
              moderatedContentLabel={t('This account was suspended for violating the')}
              ctaLabel={t('Code of Conduct')}
              // @TODO: fix navigation for cta: check moderation intro card
              ctaUrl="/legal/code-of-conduct"
              onCTAClick={handleCTAClick}
            />
          )}
          {!profileState.moderated && profileState.reported && (
            <EntryCardHidden
              reportedAccount={profileState.reported}
              reason={profileState.reason}
              headerTextLabel={t('You reported this account for the following reason')}
              footerTextLabel={t('It is awaiting moderation.')}
            />
          )}
          {profileState.moderated && profileState.delisted && (
            <ProfileDelistedCard
              name={t('Suspended Account')}
              userName={profileState.userName || ''}
            />
          )}
          {!profileState.delisted &&
            (showStat ? (
              <ProfileStatPage
                {...props}
                selectedStat={
                  selectedStat === 'followers' || selectedStat === 'following'
                    ? selectedStat
                    : 'followers'
                }
                loginState={loginQuery.data}
                profileData={profileState}
              />
            ) : (
              <ProfileCards
                {...props}
                profileData={profileState}
                profileId={pubKey}
                loginState={loginQuery.data}
              />
            ))}
        </>
      )}
    </Box>
  );
};

export default ProfilePage;
