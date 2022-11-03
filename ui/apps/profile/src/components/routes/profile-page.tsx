import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import DS from '@akashaorg/design-system';
import { RootComponentProps, IProfileData, ModalNavigationOptions } from '@akashaorg/typings/ui';
import { ProfilePageHeader } from '../profile-cards/profile-page-header';
import menuRoute, { MY_PROFILE } from '../../routes';
import { useGetProfile, LoginState, useGetLogin } from '@akashaorg/ui-awf-hooks';

const { Box, Helmet, EntryCardHidden, ErrorLoader, ProfileDelistedCard } = DS;

export interface ProfilePageProps extends RootComponentProps {
  loggedProfileData: IProfileData;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  loginState: LoginState;
}

const ProfilePage = (props: ProfilePageProps) => {
  const { plugins, loggedProfileData } = props;

  const { t } = useTranslation('app-profile');
  const location = useLocation();
  const { pubKey } = useParams<{ pubKey: string }>();

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
      {profileDataQuery.status === 'loading' && <></>}
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
          {!profileState.delisted && (
            <>
              <ProfilePageHeader
                {...props}
                modalSlotId={props.layoutConfig.modalSlotId}
                profileData={profileState}
                profileId={pubKey}
                loginState={loginQuery.data}
                navigateTo={props.plugins['@akashaorg/app-routing']?.routing?.navigateTo}
              />
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default ProfilePage;
