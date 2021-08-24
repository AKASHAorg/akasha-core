import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { moderationRequest, useErrors, useProfile } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ModalState, ModalStateActions } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';
import useLoginState from '@akashaproject/ui-awf-hooks/lib/use-login-state';
import FeedWidget from '@akashaproject/ui-widget-feed/lib/components/App';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';
// import { useFollowers } from '@akashaproject/ui-awf-hooks/lib/use-profile.new';

import { ProfilePageCard } from '../profile-cards/profile-page-header';
import menuRoute, { MY_PROFILE } from '../../routes';
import { ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { ENTRY_KEY, useInfinitePostsByAuthor } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import { useQueryClient } from 'react-query';

const { Box, EntryCardHidden, Helmet, ProfileDelistedCard, Spinner } = DS;

export interface ProfilePageProps extends RootComponentProps {
  modalActions: ModalStateActions;
  modalState: ModalState;
  loggedUser: {
    ethAddress: string | null;
    pubKey?: string | null;
  };
  loggedProfileData: any;
  showLoginModal: () => void;
}

const ProfilePage = (props: ProfilePageProps) => {
  const { loggedUser, loggedProfileData, showLoginModal } = props;

  const [requesting, setRequesting] = React.useState<boolean>(false);
  const [isDelisted, setIsDelisted] = React.useState<boolean>(false);
  const [showCard, setShowCard] = React.useState<boolean>(false);
  const [reason, setReason] = React.useState<string>('');

  const location = useLocation();
  const queryClient = useQueryClient();

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

  const [loginState] = useLoginState({});
  const reqPosts = useInfinitePostsByAuthor(publicKey, 15, loginState.currentUserCalled);

  const { t, i18n } = useTranslation();

  const [errorState, errorActions] = useErrors({
    logger: props.logger,
  });

  const [profileState, profileActions, profileUpdateStatus] = useProfile({
    onError: errorActions.createError,
    logger: props.logger,
  });

  React.useEffect(() => {
    if (pubKey) {
      profileActions.resetProfileData();
      profileActions.getProfileData({ pubKey });
    }
  }, [pubKey]);

  React.useEffect(() => {
    if (profileState.pubKey) {
      checkAccountReportStatus(profileState.pubKey);
      return;
    }
  }, [profileState]);

  /**
   * Hook used in the /profile/my-profile route
   * because we don't have the /:pubkey url param
   */
  // React.useEffect(() => {
  //   if (
  //     loggedProfileData.pubKey &&
  //     pubKey === loggedProfileData.pubKey &&
  //     !postsState.postIds.length &&
  //     !postsState.isFetchingPosts
  //   ) {
  //     postsActions.getUserPosts({ pubKey: loggedProfileData.pubKey, limit: 5 });
  //   }
  // }, [loggedProfileData.pubKey, pubKey]);

  const checkAccountReportStatus = async (user: string) => {
    setRequesting(true);
    try {
      const response = await moderationRequest.checkStatus(true, {
        user: loggedUser.pubKey,
        contentIds: [user],
      });
      if (response) {
        // the response array will have only one item
        const { reported, moderated, delisted, reason } = response[0];
        if (delisted) {
          setIsDelisted(true);
          return;
        } else if (moderated) {
          setShowCard(false);
          return;
        } else if (reported) {
          setShowCard(true);
          setReason(reason);
          return;
        }
      }
    } catch (err) {
      return;
    } finally {
      setRequesting(false);
    }
  };

  const handleLoadMore = () => {
    if (!reqPosts.isLoading && reqPosts.hasNextPage && loginState.currentUserCalled) {
      reqPosts.fetchNextPage();
    }
  };

  const handleNavigation = (itemType: ItemTypes, details: IContentClickDetails) => {
    let url;
    switch (itemType) {
      case ItemTypes.PROFILE:
        if (details.entryId === pubKey) {
          return;
        }
        url = `/profile/${details.entryId}`;
        break;
      case ItemTypes.TAG:
        url = `/social-app/tags/${details.entryId}`;
        break;
      case ItemTypes.ENTRY:
        url = `/social-app/post/${details.entryId}`;
        break;
      case ItemTypes.COMMENT:
        /* Navigate to parent post because we don't have the comment page yet */
        url = `/social-app/post/${
          queryClient.getQueryData<{ postId: string }>([ENTRY_KEY, details.entryId]).postId
        }`;
        break;
      default:
        break;
    }
    props.singleSpa.navigateToUrl(url);
  };

  const profileUserName = React.useMemo(() => {
    if (profileState.name) {
      return profileState.name;
    }
    if (profileState.ensName) {
      return profileState.ensName;
    }
    return pubKey;
  }, [profileState, pubKey]);

  const postPages = React.useMemo(() => {
    if (reqPosts.data) {
      return reqPosts.data.pages;
    }
    return [];
  }, [reqPosts.data]);

  const handleEntryFlag = (entryId: string, contentType: string) => () => {
    props.navigateToModal({ name: 'report-modal', entryId, contentType });
  };

  const handleEntryRemove = (entryId: string) => {
    props.navigateToModal({ name: 'entry-remove-confirmation', entryId, entryType: 'Post' });
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>
          {t("{{profileUsername}}'s Page", { profileUsername: profileUserName || '' })} | Ethereum
          World
        </title>
      </Helmet>
      {requesting && <Spinner />}
      {!requesting && showCard && (
        <EntryCardHidden
          reportedAccount={true}
          reason={reason}
          headerTextLabel={t('You reported this account for the following reason')}
          footerTextLabel={t('It is awaiting moderation.')}
        />
      )}
      {!requesting && isDelisted && (
        <EntryCardHidden
          isDelisted={isDelisted}
          delistedAccount={isDelisted}
          moderatedContentLabel={t('This account was suspended for violating the')}
          ctaLabel={t('Code of Conduct')}
          ctaUrl="/legal/code-of-conduct"
        />
      )}
      {!requesting && isDelisted && (
        <ProfileDelistedCard name={t('Suspended Account')} userName={profileState.userName || ''} />
      )}
      {!requesting && !isDelisted && (
        <ProfilePageCard
          {...props}
          profileState={profileState}
          profileActions={profileActions}
          profileUpdateStatus={profileUpdateStatus}
          profileId={pubKey}
          loggedUserEthAddress={loggedUser.ethAddress}
          modalActions={props.modalActions}
          modalState={props.modalState}
        />
      )}
      {!requesting && !isDelisted && (
        <FeedWidget
          itemType={ItemTypes.ENTRY}
          logger={props.logger}
          onLoadMore={handleLoadMore}
          getShareUrl={(itemId: string) => `${window.location.origin}/social-app/post/${itemId}`}
          pages={postPages}
          requestStatus={reqPosts.status}
          errors={errorState}
          ethAddress={loggedUser.ethAddress}
          onNavigate={handleNavigation}
          singleSpaNavigate={props.singleSpa.navigateToUrl}
          navigateToModal={props.navigateToModal}
          onLoginModalOpen={showLoginModal}
          hasNextPage={reqPosts.hasNextPage}
          profilePubKey={pubKey}
          loggedProfile={loggedProfileData}
          contentClickable={true}
          onEntryFlag={handleEntryFlag}
          onEntryRemove={handleEntryRemove}
          removeEntryLabel={t('Delete Post')}
          removedByMeLabel={t('You deleted this post')}
          removedByAuthorLabel={t('This post was deleted by its author')}
          uiEvents={props.uiEvents}
          itemSpacing={8}
          locale={i18n.languages[0]}
        />
      )}
    </Box>
  );
};

export default ProfilePage;
