import React from 'react';
import { useTranslation } from 'react-i18next';
import { ModalNavigationOptions, Profile } from '@akashaorg/typings/lib/ui';
import {
  useAnalytics,
  useRootComponentProps,
  transformSource,
  mapBeamEntryData,
  hasOwn,
} from '@akashaorg/ui-awf-hooks';
import routes, { EDITOR } from '../../../routes';
import EditorPlaceholder from '@akashaorg/design-system-components/lib/components/EditorPlaceholder';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Helmet from '@akashaorg/design-system-core/lib/utils/helmet';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import { BeamCard, BeamContentResolver, BeamFeed } from '@akashaorg/ui-lib-feed';

export type FeedPageProps = {
  isLoggedIn: boolean;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  authenticatedProfile?: Profile;
};

const FeedPage: React.FC<FeedPageProps> = props => {
  const { authenticatedProfile, isLoggedIn } = props;
  const { getRoutingPlugin } = useRootComponentProps();
  const { t } = useTranslation('app-akasha-integration');
  const [analyticsActions] = useAnalytics();

  const navigateTo = React.useRef(getRoutingPlugin().navigateTo);

  const handleEditorPlaceholderClick = () => {
    navigateTo?.current({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: () => `/${routes[EDITOR]}`,
    });
  };

  const listHeader = React.useMemo(() => {
    if (isLoggedIn && authenticatedProfile?.did?.id) {
      return (
        <Stack customStyle="mb-4">
          <EditorPlaceholder
            profileId={authenticatedProfile.did.id}
            avatar={authenticatedProfile.avatar}
            actionLabel={t(`Start Beaming`)}
            placeholderLabel={t(`From Your Mind to the World 🧠 🌏 ✨`)}
            onClick={handleEditorPlaceholderClick}
            transformSource={transformSource}
          />
        </Stack>
      );
    }
  }, [isLoggedIn, authenticatedProfile, t]);

  return (
    <Stack fullWidth={true}>
      <Helmet.Helmet>
        <title>AKASHA World</title>
      </Helmet.Helmet>
      <BeamFeed
        header={listHeader}
        queryKey={'app-akasha-integration_general-antenna'}
        estimatedHeight={150}
        itemSpacing={8}
        scrollerOptions={{ overscan: 10 }}
        scrollTopIndicator={(listRect, onScrollToTop) => (
          <ScrollTopWrapper placement={listRect.left}>
            <ScrollTopButton hide={false} onClick={onScrollToTop} />
          </ScrollTopWrapper>
        )}
        trackEvent={analyticsActions.trackEvent}
      />
    </Stack>
  );
};

export default FeedPage;
