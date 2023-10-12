import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { IPublishData, EntityTypes, AnalyticsCategories } from '@akashaorg/typings/lib/ui';
import {
  useMutationsListener,
  useAnalytics,
  useDismissedCard,
  useEntryNavigation,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { Extension } from '@akashaorg/ui-lib-extensions/lib/react/extension';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/app';
import { Profile } from '@akashaorg/typings/lib/ui';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';
import LoginCTACard from '@akashaorg/design-system-components/lib/components/LoginCTACard';
import EntryPublishErrorCard from '@akashaorg/design-system-components/lib/components/Entry/EntryPublishErrorCard';

export type FeedPageProps = {
  showModal: (name: string, data?: Record<string, unknown>) => void;
  loggedProfileData?: Profile;
};

const FeedPage: React.FC<FeedPageProps> = props => {
  const { loggedProfileData, showModal } = props;
  const { getRoutingPlugin } = useRootComponentProps();
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

  const showLoginModal = React.useCallback(
    (modalData?: Record<string, unknown>) => {
      showModal('login', modalData);
    },
    [showModal],
  );

  const handleEntryFlag = React.useCallback(
    (itemId: string, itemType: EntityTypes) => () => {
      if (!loggedProfileData?.did?.id) {
        return showLoginModal({
          redirectTo: { modal: { name: 'report-modal', itemId, itemType } },
        });
      }
      showModal('report-modal', { itemId, itemType });
    },
    [loggedProfileData?.did?.id, showLoginModal, showModal],
  );

  const handleEntryRemove = React.useCallback(
    (itemId: string) => {
      showModal('entry-remove-confirmation', {
        itemType: EntityTypes.BEAM,
        itemId,
      });
    },
    [showModal],
  );

  const handleWriteToUsLabelClick = () => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.INVITATION_CODE,
      action: 'Request',
      name: 'Feed',
    });
  };

  const handleRebeam = (_: boolean, beamId: string) => {
    if (!loggedProfileData?.did.id) {
      showLoginModal();
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
                extensionData={{ itemId: postId, itemType: EntityTypes.BEAM, action: 'rebeam' }}
              />
            ) : (
              <Extension name="beam-editor_feed_page" extensionData={{ action: 'beam' }} />
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
              writeToUsUrl={'mailto:alpha@akasha.world'}
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
