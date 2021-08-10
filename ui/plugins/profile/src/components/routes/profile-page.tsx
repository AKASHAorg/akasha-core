import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { moderationRequest, useErrors, useProfile } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { ModalState, ModalStateActions } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';
import { UseLoginActions } from '@akashaproject/ui-awf-hooks/lib/use-login-state';
import FeedWidget from '@akashaproject/ui-widget-feed/lib/components/App';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';
// import { useFollowers } from '@akashaproject/ui-awf-hooks/lib/use-profile.new';

import { ProfilePageCard } from '../profile-cards/profile-page-header';
import menuRoute, { MY_PROFILE } from '../../routes';
import { ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { useInfinitePostsByAuthor } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import { mapEntry } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';
import { useQueryClient } from 'react-query';

const { Box, EntryCardHidden, Helmet, ProfileDelistedCard, Spinner } = DS;

export interface ProfilePageProps extends RootComponentProps {
  modalActions: ModalStateActions;
  modalState: ModalState;
  loggedEthAddress: string | null;
  loginActions: UseLoginActions;
  loggedProfileData: any;
  showLoginModal: () => void;
}

const ProfilePage = (props: ProfilePageProps) => {
  const { loggedEthAddress, loginActions, loggedProfileData, showLoginModal } = props;

  const [requesting, setRequesting] = React.useState<boolean>(false);
  const [isDelisted, setIsDelisted] = React.useState<boolean>(false);
  const [showCard, setShowCard] = React.useState<boolean>(false);
  const [reason, setReason] = React.useState<string>('');

  const location = useLocation();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  let { pubKey } = useParams() as any;

  if (location.pathname.includes(menuRoute[MY_PROFILE])) {
    pubKey = loggedProfileData.pubKey;
  }
  const [errorState, errorActions] = useErrors({
    logger: props.logger,
  });

  const [profileState, profileActions, profileUpdateStatus] = useProfile({
    onError: errorActions.createError,
    logger: props.logger,
  });

  const reqPosts = useInfinitePostsByAuthor(pubKey, 15);
  const postsState = reqPosts.data;
  const ids = React.useMemo(() => {
    const list = [];
    if (!reqPosts.isSuccess) {
      return list;
    }
    postsState.pages.forEach(page => page.results.forEach(postId => list.push(postId)));
    return list;
  }, [reqPosts.isSuccess]);

  const entriesData = React.useMemo(() => {
    const list = {};
    if (!reqPosts.isSuccess) {
      return list;
    }
    postsState.pages.forEach(page =>
      page.results.forEach(
        postId => (list[postId] = mapEntry(queryClient.getQueryData(['Entry', postId]))),
      ),
    );
    return list;
  }, [reqPosts.isSuccess]);

  React.useEffect(() => {
    if (pubKey) {
      profileActions.resetProfileData();
      profileActions.getProfileData({ pubKey });
    }
  }, [pubKey]);

  React.useEffect(() => {
    if (profileState.ethAddress) {
      checkAccountReportStatus(profileState.ethAddress);
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

  const checkAccountReportStatus = async (profileEthAddress: string) => {
    setRequesting(true);
    try {
      const response = await moderationRequest.checkStatus(true, {
        user: loggedEthAddress,
        contentIds: [profileEthAddress],
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
    if (!reqPosts.isFetching && pubKey) {
      reqPosts.fetchNextPage();
    }
  };

  const handleItemDataLoad = ({ itemId }: { itemId: string }) => {
    // postsActions.getPost(itemId);
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
        url = `/social-app/post/${entriesData[details.entryId].postId}`;
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

  const handleEntryFlag = (entryId: string, contentType: string) => () => {
    props.navigateToModal({ name: 'report-modal', entryId, contentType });
  };

  const handleFlipCard = (_entry: any, _isQuote: boolean) => () => {
    // const modifiedEntry = isQuote
    //   ? { ...entry, quote: { ...entry.quote, reported: false } }
    //   : { ...entry, reported: false };
    // postsActions.updatePostsState(modifiedEntry);
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
          headerTextLabel={t(`You reported this account for the following reason`)}
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
          loggedUserEthAddress={loggedEthAddress}
          modalActions={props.modalActions}
          modalState={props.modalState}
          loginActions={loginActions}
        />
      )}
      {!requesting && !isDelisted && (
        <FeedWidget
          itemType={ItemTypes.ENTRY}
          logger={props.logger}
          loadMore={handleLoadMore}
          loadItemData={handleItemDataLoad}
          getShareUrl={(itemId: string) => `${window.location.origin}/social-app/post/${itemId}`}
          itemIds={ids}
          itemsData={entriesData}
          errors={errorState}
          ethAddress={loggedEthAddress}
          onNavigate={handleNavigation}
          singleSpaNavigate={props.singleSpa.navigateToUrl}
          navigateToModal={props.navigateToModal}
          onLoginModalOpen={showLoginModal}
          // totalItems={postsState.totalItems}
          hasMoreItems={!!reqPosts.hasNextPage}
          profilePubKey={pubKey}
          loggedProfile={loggedProfileData}
          contentClickable={true}
          onEntryFlag={handleEntryFlag}
          handleFlipCard={handleFlipCard}
          onEntryRemove={handleEntryRemove}
          removeEntryLabel={t('Delete Post')}
          removedByMeLabel={t('You deleted this post')}
          removedByAuthorLabel={t('This post was deleted by its author')}
          uiEvents={props.uiEvents}
        />
      )}
    </Box>
  );
};

export default ProfilePage;
