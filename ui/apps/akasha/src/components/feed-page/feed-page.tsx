import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ILocale } from '@akashaorg/design-system-core/lib/utils/time';
import {
  ModalNavigationOptions,
  IPublishData,
  RootComponentProps,
  EntityTypes,
  AnalyticsCategories,
} from '@akashaorg/typings/ui';
import {
  CREATE_POST_MUTATION_KEY,
  useMutationsListener,
  createPendingEntry,
  useAnalytics,
  useDismissedCard,
  useInfiniteDummy,
} from '@akashaorg/ui-awf-hooks';
import Extension from '@akashaorg/design-system-components/lib/components/Extension';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/App';
import routes, { POST } from '../../routes';
import { Profile } from '@akashaorg/typings/ui';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';
import EntryCard from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import LoginCTACard from '@akashaorg/design-system-components/lib/components/LoginCTACard';
import EntryPublishErrorCard from '@akashaorg/design-system-components/lib/components/Entry/EntryPublishErrorCard';

export interface FeedPageProps {
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  loggedProfileData?: Profile;
}

const FeedPage: React.FC<FeedPageProps & RootComponentProps> = props => {
  const {
    logger,
    loggedProfileData,
    plugins,
    uiEvents,
    layoutConfig,
    showLoginModal,
    navigateToModal,
  } = props;

  const { t } = useTranslation('app-akasha-integration');
  const locale = (plugins['@akashaorg/app-translation']?.translation?.i18n?.languages?.[0] ||
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

  const dismissedCardId = '@akashaorg/app-akasha-integration_private-alpha-notification';

  const [dismissed, dismissCard] = useDismissedCard(dismissedCardId);

  const { mutations: pendingPostStates } = useMutationsListener<IPublishData>([
    CREATE_POST_MUTATION_KEY,
  ]);

  const postsReq = useInfiniteDummy([]);

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
        return showLoginModal({ modal: { name: 'report-modal', itemId, itemType } });
      }
      navigateToModal({ name: 'report-modal', itemId, itemType });
    },
    [loggedProfileData?.did?.id],
  );

  const handleEntryRemove = React.useCallback((itemId: string) => {
    navigateToModal({
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

  return (
    <Box customStyle={'w-full'}>
      <Helmet.Helmet>
        <title>AKASHA World</title>
      </Helmet.Helmet>
      {loggedProfileData?.did?.id ? (
        <>
          <Box customStyle="mb-1">
            {postId ? (
              <Extension
                name={`inline-editor_repost_${postId}`}
                uiEvents={uiEvents}
                data={{ itemId: postId, itemType: EntityTypes.POST, action: 'repost' }}
              />
            ) : (
              <Extension
                name="inline-editor_feed_page"
                uiEvents={uiEvents}
                data={{ action: 'post' }}
              />
            )}
          </Box>
        </>
      ) : (
        !dismissed && (
          <Box customStyle="mb-2">
            <LoginCTACard
              title={`${t('Welcome, fellow Ethereans!')} 💫`}
              subtitle={t('We are in private alpha at this time. ')}
              beforeLinkLabel={t("If you'd like to participate, just ")}
              afterLinkLabel={t(
                " and we'll send you a ticket for the next shuttle going to AKASHA World.",
              )}
              disclaimerLabel={t(
                "Please bear in mind we're onboarding new people gradually to make sure our systems can scale up. Bon voyage! 🚀",
              )}
              writeToUsLabel={t('drop us a message')}
              writeToUsUrl={'mailto:alpha@ethereum.world'}
              onWriteToUsLabelClick={handleWriteToUsLabelClick}
              onCloseIconClick={dismissCard}
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
              !postPages?.includes(pendingPostState.state.data.toString() as any))) && (
            <EntryCard
              key={pendingPostState.mutationId}
              style={{ backgroundColor: '#4e71ff0f', marginBottom: '0.5rem' }}
              entryData={createPendingEntry(loggedProfileData, pendingPostState.state.variables)}
              flagAsLabel={t('Report Post')}
              locale={locale || 'en'}
              showMore={true}
              profileAnchorLink={'/profile'}
              repliesAnchorLink={routes[POST]}
              contentClickable={false}
              hidePublishTime={true}
              disableActions={true}
            />
          ),
      )}
      <FeedWidget
        modalSlotId={layoutConfig.modalSlotId}
        logger={logger}
        itemType={EntityTypes.POST}
        // @TODO replace with real data source
        pages={[]}
        onLoadMore={handleLoadMore}
        getShareUrl={(itemId: string) =>
          `${window.location.origin}/@akashaorg/app-akasha-integration/post/${itemId}`
        }
        loggedProfileData={loggedProfileData}
        navigateTo={plugins['@akashaorg/app-routing']?.routing?.navigateTo}
        navigateToModal={navigateToModal}
        onLoginModalOpen={showLoginModal}
        // @TODO replace with real data source
        requestStatus={null}
        // @TODO replace with real data source
        hasNextPage={false}
        contentClickable={true}
        onEntryFlag={handleEntryFlag}
        onEntryRemove={handleEntryRemove}
        removeEntryLabel={t('Delete Post')}
        removedByMeLabel={t('You deleted this post')}
        removedByAuthorLabel={t('This post was deleted by its author')}
        uiEvents={uiEvents}
        itemSpacing={8}
        i18n={plugins['@akashaorg/app-translation']?.translation?.i18n}
      />
    </Box>
  );
};

export default FeedPage;
