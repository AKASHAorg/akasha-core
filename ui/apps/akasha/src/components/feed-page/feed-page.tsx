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
  useMutationsListener,
  useAnalytics,
  useDismissedCard,
  useEntryNavigation,
} from '@akashaorg/ui-awf-hooks';
import Extension from '@akashaorg/design-system-components/lib/components/Extension';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/app';
import { Profile } from '@akashaorg/typings/ui';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';
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
    [loggedProfileData?.did?.id],
  );

  const handleEntryRemove = React.useCallback((itemId: string) => {
    navigateToModal({
      name: 'entry-remove-confirmation',
      itemType: EntityTypes.BEAM,
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

  const handleRebeam = (withComment: boolean, beamId: string) => {
    if (!loggedProfileData?.did.id) {
      navigateToModal({ name: 'login' });
    } else {
      plugins['@akashaorg/app-routing'].navigateTo?.({
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
        modalSlotId={layoutConfig.modalSlotId}
        itemType={EntityTypes.BEAM}
        loggedProfileData={loggedProfileData}
        navigateToModal={navigateToModal}
        onLoginModalOpen={showLoginModal}
        contentClickable={true}
        onEntryFlag={handleEntryFlag}
        onEntryRemove={handleEntryRemove}
        uiEvents={uiEvents}
        itemSpacing={8}
        i18n={plugins['@akashaorg/app-translation']?.translation?.i18n}
        onRebeam={handleRebeam}
        onNavigate={useEntryNavigation(plugins['@akashaorg/app-routing']?.routing?.navigateTo)}
      />
    </Stack>
  );
};

export default FeedPage;
