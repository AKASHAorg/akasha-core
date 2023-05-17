import React from 'react';
import DS from '@akashaorg/design-system';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import PageByType, { PageType } from './page-by-type';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import { RootComponentProps, Profile } from '@akashaorg/typings/ui';
import { useGetProfile, useGetLogin } from '@akashaorg/ui-awf-hooks';
const { Box, Helmet } = DS;
export interface IndexProps extends RootComponentProps {
  loggedProfileData: Profile;
  pageType?: PageType;
}
const Index = (props: IndexProps) => {
  const { plugins, loggedProfileData, pageType } = props;
  const { t } = useTranslation('app-profile');
  const location = useLocation();

  // @TODO replace with did
  const { pubKey } = useParams<{
    pubKey: string;
  }>();
  const routing = plugins['@akashaorg/app-routing']?.routing;
  const publicKey = React.useMemo(() => {
    if (location.pathname.includes('app-profile')) {
      if (loggedProfileData && loggedProfileData.did.id) {
        return loggedProfileData.did.id;
      }
      return undefined;
    }
    return pubKey;
  }, [pubKey, loggedProfileData, location.pathname]);

  // @TODO replace with new hooks
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
      getNavigationUrl: () => '/code-of-conduct',
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
      {(profileDataQuery.status === 'error' ||
        (profileDataQuery.status === 'success' && !profileState)) && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading this profile')}
          details={t('We cannot show this profile right now')}
          devDetails={profileDataQuery.error?.message}
        />
      )}
      {profileDataQuery.status !== 'error' && (
        <PageByType
          {...props}
          pageType={pageType}
          // @TODO pass updated data from new hooks here
          profileData={null}
          loggedProfileData={loggedProfileData}
          isLoading={profileDataQuery.status === 'loading'}
          onCTAClick={handleCTAClick}
        />
      )}
    </Box>
  );
};
export default Index;
