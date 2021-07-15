import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { constants, useErrors, usePosts, useProfile } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/src';
import getSDK from '@akashaproject/awf-sdk';
import { ModalState, ModalStateActions } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';
import { UseLoginActions } from '@akashaproject/ui-awf-hooks/lib/use-login-state';
import FeedWidget, { ItemTypes } from '@akashaproject/ui-widget-feed/lib/components/App';
import { ILoadItemsPayload } from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';

import { ProfilePageCard } from '../profile-cards/profile-page-header';
import menuRoute, { MY_PROFILE } from '../../routes';

const { Box, Helmet, ReportModal, ToastProvider, ModalRenderer } = DS;

export interface ProfilePageProps extends RootComponentProps {
  modalActions: ModalStateActions;
  modalState: ModalState;
  loggedEthAddress: string | null;
  loginActions: UseLoginActions;
  loggedProfileData: any;
  flagged: string;
  flaggedContentType: string;
  reportModalOpen: boolean;
  showLoginModal: () => void;
  setFlagged: React.Dispatch<React.SetStateAction<string>>;
  setFlaggedContentType: React.Dispatch<React.SetStateAction<string>>;
  setReportModalOpen: () => void;
  closeReportModal: () => void;
}

const ProfilePage = (props: ProfilePageProps) => {
  const {
    loggedEthAddress,
    loginActions,
    loggedProfileData,
    flagged,
    flaggedContentType,
    reportModalOpen,
    showLoginModal,
    setFlagged,
    setFlaggedContentType,
    setReportModalOpen,
    closeReportModal,
  } = props;

  const sdk = getSDK();

  const location = useLocation();

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

  const [postsState, postsActions] = usePosts({
    onError: errorActions.createError,
    user: loggedEthAddress,
  });

  // React.useEffect(() => {
  //   // reset post ids and virtual list, if user logs in
  //   if (loggedEthAddress) {
  //     postsActions.resetPostIds();
  //   }
  // }, [loggedEthAddress]);

  React.useEffect(() => {
    if (pubKey) {
      profileActions.resetProfileData();
      profileActions.getProfileData({ pubKey });
      // postsActions.resetPostIds();
    }
  }, [pubKey]);

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

  const { t } = useTranslation();

  const handleLoadMore = (payload: ILoadItemsPayload) => {
    const req: { limit: number; offset?: string } = {
      limit: payload.limit,
    };
    if (!postsState.isFetchingPosts && pubKey) {
      postsActions.getUserPosts({ pubKey, ...req });
    }
  };

  const handleItemDataLoad = ({ itemId }: { itemId: string }) => {
    postsActions.getPost(itemId);
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
        url = `/social-app/post/${postsState.postsData[details.entryId].postId}`;
        break;
      default:
        break;
    }
    props.singleSpa.navigateToUrl(url);
  };

  const handleRepostPublish = (entryData: any, embedEntry: any) => {
    postsActions.optimisticPublishPost(entryData, loggedProfileData, embedEntry, true);
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
    setFlagged(entryId);
    setFlaggedContentType(contentType);
    setReportModalOpen();
  };

  const handleFlipCard = (entry: any, isQuote: boolean) => () => {
    const modifiedEntry = isQuote
      ? { ...entry, quote: { ...entry.quote, reported: false } }
      : { ...entry, reported: false };
    postsActions.updatePostsState(modifiedEntry);
  };

  const updateEntry = (entryId: string) => {
    const modifiedEntry = { ...postsState.postsData[entryId], reported: true };
    postsActions.updatePostsState(modifiedEntry);
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
      <ModalRenderer slotId={props.layoutConfig.modalSlotId}>
        {reportModalOpen && (
          <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
            <ReportModal
              titleLabel={t(`Report ${flaggedContentType}`)}
              successTitleLabel={t('Thank you for helping us keep Ethereum World safe! 🙌')}
              successMessageLabel={t('We will investigate this post and take appropriate action.')}
              optionsTitleLabel={t('Please select a reason')}
              optionLabels={[
                t('Threats of violence and incitement'),
                t('Hate speech, bullying and harassment'),
                t('Sexual or human exploitation'),
                t('Illegal or certain regulated goods or services'),
                t('Impersonation'),
                t('Spam and malicious links'),
                t('Privacy and copyright infringement'),
                t('Other'),
              ]}
              optionValues={[
                'Threats of violence and incitement',
                'Hate speech, bullying and harassment',
                'Sexual or human exploitation',
                'Illegal or certain regulated goods or services',
                'Impersonation',
                'Spam and malicious links',
                'Privacy and copyright infringement',
                'Other',
              ]}
              descriptionLabel={t('Explanation')}
              descriptionPlaceholder={t('Please explain your reason(s)')}
              footerText1Label={t('If you are unsure, you can refer to our')}
              footerLink1Label={t('Code of Conduct')}
              footerUrl1={'/legal/code-of-conduct'}
              cancelLabel={t('Cancel')}
              reportLabel={t('Report')}
              blockLabel={t('Block User')}
              closeLabel={t('Close')}
              user={loggedEthAddress ? loggedEthAddress : ''}
              contentId={flagged}
              contentType={flaggedContentType}
              baseUrl={constants.BASE_REPORT_URL}
              updateEntry={updateEntry}
              closeModal={closeReportModal}
              signData={sdk.api.auth.signData}
            />
          </ToastProvider>
        )}
      </ModalRenderer>
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
      <FeedWidget
        itemType={ItemTypes.ENTRY}
        logger={props.logger}
        loadMore={handleLoadMore}
        loadItemData={handleItemDataLoad}
        getShareUrl={(itemId: string) => `${window.location.origin}/social-app/post/${itemId}`}
        itemIds={postsState.postIds}
        itemsData={postsState.postsData}
        errors={errorState}
        layout={props.layoutConfig}
        ethAddress={loggedEthAddress}
        onNavigate={handleNavigation}
        singleSpaNavigate={props.singleSpa.navigateToUrl}
        onLoginModalOpen={showLoginModal}
        totalItems={postsState.totalItems}
        profilePubKey={pubKey}
        modalSlotId={props.layoutConfig.modalSlotId}
        loggedProfile={loggedProfileData}
        onRepostPublish={handleRepostPublish}
        contentClickable={true}
        onEntryFlag={handleEntryFlag}
        handleFlipCard={handleFlipCard}
        onEntryRemove={handleEntryRemove}
        removeEntryLabel={t('Delete Post')}
        removedByMeLabel={t('You deleted this post')}
        removedByAuthorLabel={t('This post was deleted by its author')}
      />
    </Box>
  );
};

export default ProfilePage;
