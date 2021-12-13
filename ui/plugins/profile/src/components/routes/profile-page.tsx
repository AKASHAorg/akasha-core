import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import FeedWidget from '@akashaproject/ui-widget-feed/lib/components/App';
import { ProfilePageHeader } from '../profile-cards/profile-page-header';
import menuRoute, { MY_PROFILE } from '../../routes';
import { ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import {
  useGetProfile,
  useInfinitePostsByAuthor,
  LoginState,
  useGetLogin,
} from '@akashaproject/ui-awf-hooks';
import { IProfileData } from '@akashaproject/ui-awf-typings/lib/profile';
import { ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';

const { Box, Helmet, EntryCardHidden, ErrorLoader, ProfileDelistedCard } = DS;

export interface ProfilePageProps extends RootComponentProps {
  loggedProfileData: IProfileData;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  loginState: LoginState;
}

const ProfilePage = (props: ProfilePageProps) => {
  const { t, i18n } = useTranslation();
  const { loggedProfileData, showLoginModal } = props;
  const [erroredHooks, setErroredHooks] = React.useState([]);

  const location = useLocation();
  const { pubKey } = useParams<{ pubKey: string }>();

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

  const reqPosts = useInfinitePostsByAuthor(
    publicKey,
    15,
    !!publicKey && !erroredHooks.includes('useInfinitePostsByAuthor'),
  );

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
      entryType: ItemTypes.ENTRY,
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
              ctaUrl="/legal/code-of-conduct"
            />
          )}
          {!profileState.moderated && profileState.reported && (
            <EntryCardHidden
              reportedAccount={profileState.reported}
              reason={profileState.reason}
              headerTextLabel={t(`You reported this account for the following reason`)}
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
                  itemType={ItemTypes.ENTRY}
                  logger={props.logger}
                  onLoadMore={handleLoadMore}
                  getShareUrl={(itemId: string) =>
                    `${window.location.origin}/social-app/post/${itemId}`
                  }
                  pages={postPages}
                  requestStatus={reqPosts.status}
                  loginState={loginQuery.data}
                  loggedProfile={loggedProfileData}
                  singleSpaNavigate={props.singleSpa.navigateToUrl}
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
                  i18n={i18n}
                />
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default ProfilePage;
