import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  IPublishData,
  EntityTypes,
  AnalyticsCategories,
  ModalNavigationOptions,
  Profile,
} from '@akashaorg/typings/lib/ui';
import {
  useMutationsListener,
  useAnalytics,
  useDismissedCard,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import routes, { EDITOR } from '../../../routes';
import EditorPlaceholder from '@akashaorg/design-system-components/lib/components/EditorPlaceholder';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/app';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';
import LoginCTACard from '@akashaorg/design-system-components/lib/components/LoginCTACard';
import EntryPublishErrorCard from '@akashaorg/design-system-components/lib/components/Entry/EntryPublishErrorCard';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import BeamCard from '@akashaorg/ui-lib-feed/lib/components/cards/beam-card';
import { AkashaBeamEdge } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export type FeedPageProps = {
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  loggedProfileData?: Profile;
};

const FeedPage: React.FC<FeedPageProps> = props => {
  const { loggedProfileData, showLoginModal } = props;
  const { getRoutingPlugin, navigateToModal } = useRootComponentProps();
  const { t } = useTranslation('app-akasha-integration');
  const [analyticsActions] = useAnalytics();

  //get the post id for repost from the search param
  const [postId, setPostId] = React.useState(new URLSearchParams(location.search).get('repost'));

  const navigateTo = React.useRef(getRoutingPlugin().navigateTo);

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

  const { mutations: pendingPostStates } = useMutationsListener<
    IPublishData,
    unknown //@TODO remove the mutations listener altogether or use proper type
  >(['CREATE_POST_MUTATION_KEY']);

  const handleEntryFlag = React.useCallback(
    (itemId: string, itemType: EntityTypes) => () => {
      if (!loggedProfileData?.did?.id) {
        return showLoginModal({ modal: { name: 'report-modal', itemId, itemType } });
      }
      navigateToModal({ name: 'report-modal', itemId, itemType });
    },
    [loggedProfileData?.did?.id, navigateToModal, showLoginModal],
  );

  const handleEntryRemove = React.useCallback(
    (itemId: string) => {
      navigateToModal({
        name: 'entry-remove-confirmation',
        itemType: EntityTypes.BEAM,
        itemId,
      });
    },
    [navigateToModal],
  );

  const handleWriteToUsLabelClick = () => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.INVITATION_CODE,
      action: 'Request',
      name: 'Feed',
    });
  };

  const handleEditorPlaceholderClick = () => {
    navigateTo?.current({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: () => `/${routes[EDITOR]}`,
    });
  };

  return (
    <Stack fullWidth={true}>
      <Helmet.Helmet>
        <title>AKASHA World</title>
      </Helmet.Helmet>
      {loggedProfileData?.did?.id ? (
        <Stack customStyle="mb-4">
          <EditorPlaceholder
            profileId={loggedProfileData.did.id}
            avatar={loggedProfileData.avatar}
            actionLabel={t(`Start Beaming`)}
            placeholderLabel={t(`From Your Mind to the World 🧠 🌏 ✨`)}
            onClick={handleEditorPlaceholderClick}
          />
        </Stack>
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
      <FeedWidget<AkashaBeamEdge>
        queryKey={'app-akasha-integration_general-antenna'}
        estimatedHeight={150}
        itemSpacing={8}
        itemType={EntityTypes.BEAM}
        scrollerOptions={{ overscan: 10 }}
        scrollTopIndicator={(listRect, onScrollToTop) => (
          <ScrollTopWrapper placement={listRect.left}>
            <ScrollTopButton hide={false} onClick={onScrollToTop} />
          </ScrollTopWrapper>
        )}
        renderItem={itemData => (
          <BeamCard
            entryData={itemData.node}
            contentClickable={true}
            onContentClick={() =>
              navigateTo.current({
                appName: '@akashaorg/app-akasha-integration',
                getNavigationUrl: navRoutes => `${navRoutes.Beam}/${itemData.node.id}`,
              })
            }
          />
        )}
        trackEvent={analyticsActions.trackEvent}
      />
    </Stack>
  );
};

export default FeedPage;
