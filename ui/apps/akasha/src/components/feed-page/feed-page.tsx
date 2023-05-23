import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaorg/design-system';
import { ILocale } from '@akashaorg/design-system/src/utils/time';
import {
  ModalNavigationOptions,
  IPublishData,
  RootComponentProps,
  EntityTypes,
  AnalyticsCategories,
} from '@akashaorg/typings/ui';
import {
  useInfinitePosts,
  CREATE_POST_MUTATION_KEY,
  useMutationsListener,
  createPendingEntry,
  useAnalytics,
  useDismissedCard,
} from '@akashaorg/ui-awf-hooks';
import { Extension } from '@akashaorg/design-system/lib/utils/extension';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/App';
import routes, { POST } from '../../routes';
import { Profile } from '@akashaorg/typings/ui';

const { Box, Helmet, EntryCard, EntryPublishErrorCard, LoginCTAWidgetCard, BasicCardBox, Text } =
  DS;

export interface FeedPageProps {
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  loggedProfileData?: Profile;
}

const FeedPage: React.FC<FeedPageProps & RootComponentProps> = props => {
  const { logger, loggedProfileData } = props;

  const { t } = useTranslation('app-akasha-integration');
  const locale = (props.plugins['@akashaorg/app-translation']?.translation?.i18n?.languages?.[0] ||
    'en') as ILocale;

  const [analyticsActions] = useAnalytics();

  //get the post id for repost from the search param
  const [postId, setPostId] = React.useState(new URLSearchParams(location.search).get('repost'));

  React.useEffect(() => {
    const controller = new AbortController();
    /*The single-spa:before-routing-event listener is required for reposts happening from the feed page */
    const popStateHandler = () => {
      setPostId(new URLSearchParams(location.search).get('repost'));
    };
    window.addEventListener('single-spa:before-routing-event', popStateHandler, {
      signal: controller.signal,
    });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismissedCardId = 'dismiss-private-alpha-notification';
  const [dismissed, setDismissed] = useDismissedCard();

  const { mutations: pendingPostStates } = useMutationsListener<IPublishData>([
    CREATE_POST_MUTATION_KEY,
  ]);

  const postsReq = useInfinitePosts(15);

  const navigateToModal = React.useRef(props.navigateToModal);
  const showLoginModal = React.useRef(props.showLoginModal);

  const handleLoadMore = React.useCallback(() => {
    if (!postsReq.isLoading && postsReq.hasNextPage) {
      postsReq.fetchNextPage();
    }
  }, [postsReq]);

  const postPages = React.useMemo(() => {
    if (postsReq.data) {
      return postsReq.data.pages;
    }
    return [];
  }, [postsReq.data]);

  const handleEntryFlag = React.useCallback(
    (itemId: string, itemType: EntityTypes) => () => {
      if (!loggedProfileData?.did?.id) {
        return showLoginModal.current({ modal: { name: 'report-modal', itemId, itemType } });
      }
      navigateToModal.current({ name: 'report-modal', itemId, itemType });
    },
    [loggedProfileData?.did?.id],
  );

  const handleEntryRemove = React.useCallback((itemId: string) => {
    navigateToModal.current({
      name: 'entry-remove-confirmation',
      itemType: EntityTypes.POST,
      itemId,
    });
  }, []);

  const handleWriteToUsLabelClick = () => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.INVITATION_CODE,
      action: 'Request',
      name: 'Feed',
    });
  };

  const onCloseButtonClick = React.useCallback(() => setDismissed(dismissedCardId), [dismissed]);

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Ethereum World</title>
      </Helmet>
      {loggedProfileData?.did?.id ? (
        <>
          <BasicCardBox pad="medium" gap="xsmall" margin={{ bottom: 'xsmall' }}>
            <Box fill="horizontal">
              <Text size="xlarge" weight="bold">
                {t('General Social Feed')}
              </Text>
            </Box>
            <Text color="grey">{t("Check what's up from your fellow Ethereans ✨")}</Text>
          </BasicCardBox>
          <Box margin={{ bottom: 'xsmall' }}>
            {postId ? (
              <Extension
                name={`inline-editor_repost_${postId}`}
                uiEvents={props.uiEvents}
                data={{ itemId: postId, itemType: EntityTypes.POST, action: 'repost' }}
              />
            ) : (
              <Extension
                name="inline-editor_feed_page"
                uiEvents={props.uiEvents}
                data={{ action: 'post' }}
              />
            )}
          </Box>
        </>
      ) : (
        !dismissed.includes(dismissedCardId) && (
          <Box margin={{ bottom: 'small' }}>
            <LoginCTAWidgetCard
              title={`${t('Welcome, fellow Ethereans!')} 💫`}
              subtitle={t('We are in private alpha at this time. ')}
              beforeLinkLabel={t("If you'd like to participate, just ")}
              afterLinkLabel={t(
                " and we'll send you a ticket for the next shuttle going to Ethereum World.",
              )}
              disclaimerLabel={t(
                "Please bear in mind we're onboarding new people gradually to make sure our systems can scale up. Bon voyage! 🚀",
              )}
              writeToUsLabel={t('drop us a message')}
              writeToUsUrl={'mailto:alpha@ethereum.world'}
              onWriteToUsLabelClick={handleWriteToUsLabelClick}
              onCloseIconClick={onCloseButtonClick}
              key={dismissedCardId}
            />
          </Box>
        )
      )}
      {pendingPostStates?.map(
        pendingPostState =>
          pendingPostState.state.status === 'error' && (
            <EntryPublishErrorCard
              key={pendingPostState.mutationId}
              message={t('Cannot publish this entry. Please try again later!')}
            />
          ),
      )}
      {pendingPostStates?.map(
        pendingPostState =>
          (pendingPostState.state.status === 'loading' ||
            /*The following line ensures that even if the post is published pending post UI should be shown till the new entry appears on the feed */
            (pendingPostState.state.status === 'success' &&
              !postPages[0]?.results.includes(pendingPostState.state.data.toString()))) && (
            <EntryCard
              key={pendingPostState.mutationId}
              style={{ backgroundColor: '#4e71ff0f', marginBottom: '0.5rem' }}
              entryData={createPendingEntry(loggedProfileData, pendingPostState.state.variables)}
              sharePostLabel={t('Share Post')}
              shareTextLabel={t('Share this post with your friends')}
              repliesLabel=""
              repostLabel={t('Reposts')}
              repostWithCommentLabel={t('Repost with comment')}
              shareLabel={t('Share')}
              copyLinkLabel={t('Copy Link')}
              flagAsLabel={t('Report Post')}
              locale={locale || 'en'}
              showMore={true}
              profileAnchorLink={'/profile'}
              repliesAnchorLink={routes[POST]}
              contentClickable={false}
              hidePublishTime={true}
              disableActions={true}
              modalSlotId={props.layoutConfig.modalSlotId}
            />
          ),
      )}
      <FeedWidget
        modalSlotId={props.layoutConfig.modalSlotId}
        logger={logger}
        itemType={EntityTypes.POST}
        pages={postPages}
        onLoadMore={handleLoadMore}
        getShareUrl={(itemId: string) =>
          `${window.location.origin}/@akashaorg/app-akasha-integration/post/${itemId}`
        }
        loggedProfileData={loggedProfileData}
        navigateTo={props.plugins['@akashaorg/app-routing']?.routing?.navigateTo}
        navigateToModal={props.navigateToModal}
        onLoginModalOpen={props.showLoginModal}
        requestStatus={postsReq.status}
        hasNextPage={postsReq.hasNextPage}
        contentClickable={true}
        onEntryFlag={handleEntryFlag}
        onEntryRemove={handleEntryRemove}
        removeEntryLabel={t('Delete Post')}
        removedByMeLabel={t('You deleted this post')}
        removedByAuthorLabel={t('This post was deleted by its author')}
        uiEvents={props.uiEvents}
        itemSpacing={8}
        i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}
      />
    </Box>
  );
};

export default FeedPage;
