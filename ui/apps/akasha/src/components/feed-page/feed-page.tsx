import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ModalNavigationOptions,
  IPublishData,
  EntityTypes,
  AnalyticsCategories,
} from '@akashaorg/typings/lib/ui';
import {
  useMutationsListener,
  useAnalytics,
  useDismissedCard,
  useEntryNavigation,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import Extension from '@akashaorg/design-system-components/lib/components/Extension';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/app';
import { Profile } from '@akashaorg/typings/lib/ui';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';
import LoginCTACard from '@akashaorg/design-system-components/lib/components/LoginCTACard';
import EntryPublishErrorCard from '@akashaorg/design-system-components/lib/components/Entry/EntryPublishErrorCard';

export type FeedPageProps = {
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  loggedProfileData?: Profile;
};

const FeedPage: React.FC<FeedPageProps> = props => {
  const { loggedProfileData, showLoginModal } = props;

  const { uiEvents, layoutConfig, navigateToModal, getRoutingPlugin, getTranslationPlugin } =
    useRootComponentProps();

  const { t } = useTranslation('app-akasha-integration');

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
  }, []);

  const dismissedCardId = '@akashaorg/app-akasha-integration_private-alpha-notification';

  const [dismissed, dismissCard] = useDismissedCard(dismissedCardId);

  const { mutations: pendingPostStates } = useMutationsListener<IPublishData>([
    'CREATE_POST_MUTATION_KEY',
  ]);

  const handleEntryFlag = React.useCallback(
    (itemId: string, itemType: EntityTypes) => () => {
      if (!loggedProfileData?.did?.id) {
        return showLoginModal({ modal: { name: 'report-modal', itemId, itemType } });
      }
      navigateToModal({ name: 'report-modal', itemId, itemType });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loggedProfileData?.did?.id],
  );

  const handleEntryRemove = React.useCallback((itemId: string) => {
    navigateToModal({
      name: 'entry-remove-confirmation',
      itemType: EntityTypes.BEAM,
      itemId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWriteToUsLabelClick = () => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.INVITATION_CODE,
      action: 'Request',
      name: 'Feed',
    });
  };

  const handleRebeam = (withComment: boolean, beamId: string) => {
    if (!loggedProfileData?.did.id) {
      navigateToModal({ name: 'login' });
    } else {
      getRoutingPlugin().navigateTo?.({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: () => `/feed?repost=${beamId}`,
      });
    }
  };

  return (
    <Stack fullWidth={true}>
      <Helmet.Helmet>
        <title>AKASHA World</title>
      </Helmet.Helmet>
      {loggedProfileData?.did?.id ? (
        <>
          <Stack customStyle="mb-1">
            {postId ? (
              <Extension
                name={`inline-editor_repost_${postId}`}
                uiEvents={uiEvents}
                data={{ itemId: postId, itemType: EntityTypes.BEAM, action: 'repost' }}
              />
            ) : (
              <Extension
                name="beam-editor_feed_page"
                uiEvents={uiEvents}
                data={{ action: 'post' }}
              />
            )}
          </Stack>
        </>
      ) : (
        !dismissed && (
          <Stack customStyle="mb-2">
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
          </Stack>
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
      <FeedWidget
        queryKey="akashaorg-antenna-page-query"
        itemType={EntityTypes.BEAM}
        loggedProfileData={loggedProfileData}
        onLoginModalOpen={showLoginModal}
        contentClickable={true}
        onEntryFlag={handleEntryFlag}
        onEntryRemove={handleEntryRemove}
        itemSpacing={8}
        onRebeam={handleRebeam}
        trackEvent={analyticsActions.trackEvent}
        onNavigate={useEntryNavigation(getRoutingPlugin().navigateTo)}
        newItemsPublishedLabel={t('New Beams published recently')}
      />
    </Stack>
  );
};

export default FeedPage;
