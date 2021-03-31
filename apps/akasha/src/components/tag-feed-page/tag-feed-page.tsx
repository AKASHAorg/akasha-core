import * as React from 'react';
import { useParams } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { ILoadItemsPayload } from '@akashaproject/design-system/lib/components/VirtualList/interfaces';
import { constants, usePosts, useTagSubscribe, useErrors } from '@akashaproject/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import FeedWidget, { ItemTypes } from '@akashaproject/ui-widget-feed/lib/components/App';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { UseLoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/Cards/entry-cards/entry-box';
import { ITag } from '@akashaproject/design-system/lib/components/Cards/widget-cards/trending-widget-card';

const { Box, ReportModal, ToastProvider, ModalRenderer, TagProfileCard, Helmet } = DS;

interface ITagFeedPage {
  loggedProfileData?: any;
  loginState: UseLoginState;
  flagged: string;
  setFlagged: React.Dispatch<React.SetStateAction<string>>;
  reportModalOpen: boolean;
  setReportModalOpen: () => void;
  closeReportModal: () => void;
  showLoginModal: () => void;
}

const TagFeedPage: React.FC<ITagFeedPage & RootComponentProps> = props => {
  const {
    sdkModules,
    globalChannel,
    flagged,
    reportModalOpen,
    setFlagged,
    setReportModalOpen,
    closeReportModal,
    showLoginModal,
    logger,
    loggedProfileData,
    loginState,
  } = props;

  const { tagName } = useParams<{ tagName: string }>();

  const [tagData, setTagData] = React.useState<ITag | null>(null);

  React.useEffect(() => {
    if (tagName) {
      const tagsService = sdkModules.posts.tags.getTag({
        tagName,
        fields: ['name', 'posts', 'comments'],
      });
      tagsService.subscribe((resp: any) => {
        if (resp.data?.getTag) {
          const tag = {
            name: resp.data.getTag.name,
            totalPosts: resp.data.getTag.posts?.length + resp.data.getTag.comments?.length,
          };
          setTagData(tag);
        }
      });
    }
  }, [tagName]);

  const [errorState, errorActions] = useErrors({ logger });

  const [postsState, postsActions] = usePosts({
    user: loginState.ethAddress,
    postsService: sdkModules.posts,
    ipfsService: sdkModules.commons.ipfsService,
    onError: errorActions.createError,
  });

  const [tagSubscriptionState, tagSubscriptionActions] = useTagSubscribe({
    globalChannel,
    profileService: sdkModules.profiles.profileService,
    onError: errorActions.createError,
  });

  React.useEffect(() => {
    // reset post ids and virtual list, if user logs in or tag changes
    postsActions.resetPostIds();
  }, [loginState.ethAddress, tagName]);

  React.useEffect(() => {
    if (loginState.waitForAuth && !loginState.ready) {
      return;
    }
    if (
      (loginState.waitForAuth && loginState.ready) ||
      (loginState.currentUserCalled && loginState.ethAddress)
    ) {
      tagSubscriptionActions.getTagSubscriptions();
    }
  }, [JSON.stringify(loginState)]);

  React.useEffect(() => {
    // if post ids array is reset, get tag posts
    if (
      postsState.postIds.length === 0 &&
      !postsState.isFetchingPosts &&
      postsState.totalItems === null
    ) {
      postsActions.getTagPosts({ name: tagName, limit: 5 });
    }
  }, [postsState.postIds, postsState.isFetchingPosts]);

  const { t } = useTranslation();

  const handleLoadMore = (payload: ILoadItemsPayload) => {
    const req: { limit: number; offset?: string } = {
      limit: payload.limit,
    };
    if (!postsState.isFetchingPosts && tagName) {
      postsActions.getTagPosts({ name: tagName, ...req });
    }
  };

  const handleItemDataLoad = ({ itemId }: { itemId: string }) => {
    postsActions.getPost(itemId);
  };

  const handleNavigation = (itemType: ItemTypes, details: IContentClickDetails) => {
    let url;
    switch (itemType) {
      case ItemTypes.PROFILE:
        url = `/profile/${details.entryId}`;
        break;
      case ItemTypes.TAG:
        url = `/social-app/tags/${details.entryId}`;
        postsActions.resetPostIds();
        break;
      case ItemTypes.ENTRY:
        url = `/social-app/post/${details.entryId}`;
        break;
      case ItemTypes.COMMENT:
        /* Navigate to parent post because we don't have the comment page yet */
        const parentId = postsState.postsData[details.entryId].postId;
        url = `/social-app/post/${parentId}`;
        break;
      default:
        break;
    }
    props.singleSpa.navigateToUrl(url);
  };

  const handleRepostPublish = (entryData: any, embedEntry: any) => {
    postsActions.optimisticPublishPost(entryData, loggedProfileData, embedEntry, true);
  };

  const handleEntryFlag = (entryId: string) => {
    setFlagged(entryId);
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

  const handleTagSubscribe = (name: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    tagSubscriptionActions.toggleTagSubscription(name);
  };
  const handleTagUnsubscribe = (name: string) => {
    if (!loginState.ethAddress) {
      showLoginModal();
      return;
    }
    tagSubscriptionActions.toggleTagSubscription(name);
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Tag Page</title>
      </Helmet>
      <ModalRenderer slotId={props.layout.app.modalSlotId}>
        {reportModalOpen && (
          <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
            <ReportModal
              titleLabel={t('Report a Post')}
              successTitleLabel={t('Thank you for helping us keep Ethereum World safe! 🙌')}
              successMessageLabel={t('We will investigate this post and take appropriate action.')}
              optionsTitleLabel={t('Please select a reason')}
              optionLabels={[
                t('Suspicious, deceptive, or spam'),
                t('Abusive or harmful to others'),
                t('Self-harm or suicide'),
                t('Illegal'),
                t('Nudity'),
                t('Violence'),
              ]}
              optionValues={[
                'Suspicious, deceptive, or spam',
                'Abusive or harmful to others',
                'Self-harm or suicide',
                'Illegal',
                'Nudity',
                'Violence',
              ]}
              descriptionLabel={t('Explanation')}
              descriptionPlaceholder={t('Please explain your reason(s)')}
              footerText1Label={t('If you are unsure, you can refer to our')}
              footerLink1Label={t('Code of Conduct')}
              footerUrl1={'https://akasha.slab.com/public/ethereum-world-code-of-conduct-e7ejzqoo'}
              cancelLabel={t('Cancel')}
              reportLabel={t('Report')}
              blockLabel={t('Block User')}
              closeLabel={t('Close')}
              user={loginState.ethAddress ? loginState.ethAddress : ''}
              contentId={flagged}
              contentType="post"
              baseUrl={constants.BASE_FLAG_URL}
              updateEntry={updateEntry}
              closeModal={closeReportModal}
            />
          </ToastProvider>
        )}
      </ModalRenderer>
      <TagProfileCard
        tag={tagData}
        subscribedTags={tagSubscriptionState}
        handleSubscribeTag={handleTagSubscribe}
        handleUnsubscribeTag={handleTagUnsubscribe}
      />
      <FeedWidget
        // pass i18n from props (the i18next instance, not the react one!)
        i18n={props.i18n}
        itemType={ItemTypes.ENTRY}
        logger={props.logger}
        loadMore={handleLoadMore}
        loadItemData={handleItemDataLoad}
        getShareUrl={(itemId: string) => `${window.location.origin}/social-app/post/${itemId}`}
        itemIds={postsState.postIds}
        itemsData={postsState.postsData}
        errors={errorState}
        sdkModules={props.sdkModules}
        layout={props.layout}
        globalChannel={props.globalChannel}
        ethAddress={loginState.ethAddress}
        onNavigate={handleNavigation}
        onLoginModalOpen={showLoginModal}
        totalItems={postsState.totalItems}
        profilePubKey={loginState.pubKey}
        modalSlotId={props.layout.app.modalSlotId}
        loggedProfile={loggedProfileData}
        onRepostPublish={handleRepostPublish}
        contentClickable={true}
        onReport={handleEntryFlag}
        handleFlipCard={handleFlipCard}
      />
    </Box>
  );
};

export default TagFeedPage;
