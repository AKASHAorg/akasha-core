import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';

import DS from '@akashaorg/design-system';
import {
  RootComponentProps,
  EntityTypes,
  IProfileData,
  ModalNavigationOptions,
} from '@akashaorg/typings/ui';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/App';
import {
  useGetProfile,
  useInfinitePostsByAuthor,
  LoginState,
  useGetLogin,
  useGetDevKeys,
} from '@akashaorg/ui-awf-hooks';

import DevProfileCard from '../dev-dashboard/profile/dev-profile-card';
import ProfilePageHeader from '../profile-cards/profile-page-header';
import { ONBOARDING_STATUS } from '../dev-dashboard/onboarding/intro-card';

import menuRoute, {
  DEV_DASHBOARD,
  DEV_KEYS,
  MY_PROFILE,
  ONBOARDING,
  PUBLISHED_APPS,
  SIGN_MESSAGE,
  VERIFY_SIGNATURE,
} from '../../routes';

const { Box, Helmet, EntryCardHidden, ErrorLoader, ProfileDelistedCard, Spinner } = DS;

export interface ProfilePageProps extends RootComponentProps {
  loggedProfileData: IProfileData;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  loginState: LoginState;
}

const ProfilePage = (props: ProfilePageProps) => {
  const { plugins, loggedProfileData, showLoginModal } = props;
  const [erroredHooks, setErroredHooks] = React.useState([]);

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

  const isOnDevDashboard = React.useMemo(
    () => location.pathname === menuRoute[DEV_DASHBOARD],
    [location.pathname],
  );

  const loginQuery = useGetLogin();

  const profileDataQuery = useGetProfile(
    publicKey,
    loginQuery.data?.pubKey,
    loginQuery.data?.fromCache,
  );
  const profileState = profileDataQuery.data;

  const reqPosts = useInfinitePostsByAuthor(
    publicKey,
    15,
    !!publicKey && !erroredHooks.includes('useInfinitePostsByAuthor'),
  );

  const getKeysQuery = useGetDevKeys(true);

  const devKeys = getKeysQuery.data || [];

  React.useEffect(() => {
    if (reqPosts.status === 'error' && !erroredHooks.includes('useInfinitePostsByAuthor')) {
      setErroredHooks(['useInfinitePostsByAuthor']);
    }
  }, [reqPosts, erroredHooks]);

  const handleLoadMore = React.useCallback(() => {
    if (!reqPosts.isLoading && reqPosts.hasNextPage && loginQuery.data?.fromCache) {
      reqPosts.fetchNextPage();
    }
  }, [reqPosts, loginQuery.data?.fromCache]);

  const profileUserName = React.useMemo(() => {
    if (profileState && profileState.name) {
      return profileState.name;
    }
    return pubKey;
  }, [profileState, pubKey]);

  const postPages = React.useMemo(() => {
    if (reqPosts.data) {
      return reqPosts.data.pages;
    }
    return [];
  }, [reqPosts.data]);

  const isOnboarded = React.useMemo(() => {
    return Boolean(window.localStorage.getItem(ONBOARDING_STATUS));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEntryFlag = (entryId: string, itemType: string) => () => {
    if (!loginQuery.data?.pubKey) {
      return showLoginModal({ modal: { name: 'report-modal', entryId, itemType } });
    }
    props.navigateToModal({ name: 'report-modal', entryId, itemType });
  };

  const handleEntryRemove = (entryId: string) => {
    props.navigateToModal({
      name: 'entry-remove-confirmation',
      entryId,
      entryType: EntityTypes.ENTRY,
    });
  };

  const handleCTAClick = () => {
    routing.navigateTo({
      appName: '@akashaorg/app-legal',
      getNavigationUrl: () => '/legal/code-of-conduct',
    });
  };

  if (!isOnboarded && isOnDevDashboard) {
    // if user has not been onboarded, navigate to onboarding
    return plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => menuRoute[ONBOARDING],
    });
  }

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>
          {t("{{profileUsername}}'s Page", { profileUsername: profileUserName || '' })} | Ethereum
          World
        </title>
      </Helmet>
      {(profileDataQuery.status === 'loading' || profileDataQuery.status === 'idle') && <Spinner />}
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
              {isOnDevDashboard && (
                <DevProfileCard
                  titleLabel={t('Welcome to your developer Dashboard')}
                  subtitleLabels={[
                    t('Not sure where to start? Check our'),
                    t('developer documentation'),
                    '✨',
                  ]}
                  cardMenuItems={[
                    {
                      label: t('Dev Keys'),
                      route: DEV_KEYS,
                      value: devKeys,
                    },
                    {
                      label: t('Published Apps'),
                      route: PUBLISHED_APPS,
                    },
                    { label: t('Sign a Message'), route: SIGN_MESSAGE },
                    { label: t('Verify a Signature'), route: VERIFY_SIGNATURE },
                  ]}
                  ctaUrl="https://akasha-docs.pages.dev"
                  navigateTo={plugins['@akashaorg/app-routing']?.routing.navigateTo}
                />
              )}
              {!isOnDevDashboard && (
                <>
                  <ProfilePageHeader
                    {...props}
                    // modalSlotId={props.layoutConfig.modalSlotId}
                    profileData={profileState}
                    profileId={pubKey}
                    loginState={loginQuery.data}
                    // navigateTo={props.plugins['@akashaorg/app-routing']?.routing?.navigateTo}
                  />
                  {reqPosts.isError && reqPosts.error && (
                    <ErrorLoader
                      type="script-error"
                      title="Cannot get posts for this profile"
                      details={(reqPosts.error as Error).message}
                    />
                  )}
                  {reqPosts.isSuccess && !postPages && <div>There are no posts!</div>}
                  {reqPosts.isSuccess && postPages && (
                    <FeedWidget
                      modalSlotId={props.layoutConfig.modalSlotId}
                      itemType={EntityTypes.ENTRY}
                      logger={props.logger}
                      onLoadMore={handleLoadMore}
                      getShareUrl={(itemId: string) =>
                        `${window.location.origin}/social-app/post/${itemId}`
                      }
                      pages={postPages}
                      requestStatus={reqPosts.status}
                      loginState={loginQuery.data}
                      loggedProfile={loggedProfileData}
                      navigateTo={props.plugins['@akashaorg/app-routing']?.routing?.navigateTo}
                      navigateToModal={props.navigateToModal}
                      onLoginModalOpen={showLoginModal}
                      hasNextPage={reqPosts.hasNextPage}
                      contentClickable={true}
                      onEntryFlag={handleEntryFlag}
                      onEntryRemove={handleEntryRemove}
                      removeEntryLabel={t('Delete Post')}
                      removedByMeLabel={t('You deleted this post')}
                      removedByAuthorLabel={t('This post was deleted by its author')}
                      parentIsProfilePage={true}
                      uiEvents={props.uiEvents}
                      itemSpacing={8}
                      i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}
                    />
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default ProfilePage;
