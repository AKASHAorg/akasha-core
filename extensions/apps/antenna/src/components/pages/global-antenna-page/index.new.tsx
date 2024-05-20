import React, { useCallback } from 'react';
import routes, { EDITOR } from '../../../routes';
import EditorPlaceholder from '@akashaorg/design-system-components/lib/components/EditorPlaceholder';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import BeamFeed from '@akashaorg/ui-lib-feed/lib/components/beam-feed.new';
import { useTranslation } from 'react-i18next';
import {
  useAnalytics,
  useRootComponentProps,
  transformSource,
  useAkashaStore,
} from '@akashaorg/ui-awf-hooks';
import { Helmet, helmetData } from '@akashaorg/design-system-core/lib/utils';
import { ModalNavigationOptions, QueryKeys } from '@akashaorg/typings/lib/ui';

const GlobalAntennaPage: React.FC<unknown> = () => {
  const {
    data: { authenticatedProfile, authenticatedDID },
  } = useAkashaStore();
  const { getRoutingPlugin, navigateToModal, worldConfig } = useRootComponentProps();
  const { t } = useTranslation('app-antenna');
  const [analyticsActions] = useAnalytics();
  const _navigateToModal = React.useRef(navigateToModal);

  const navigateTo = React.useRef(getRoutingPlugin().navigateTo);

  const showLoginModal = React.useCallback(
    (redirectTo?: { modal: ModalNavigationOptions }, message?: string) => {
      _navigateToModal.current?.({
        name: 'login',
        redirectTo,
        message,
      });
    },
    [],
  );

  const handleEditorPlaceholderClick = useCallback(() => {
    if (!authenticatedDID) {
      showLoginModal();
      return;
    }
    navigateTo?.current({
      appName: '@akashaorg/app-antenna',
      getNavigationUrl: () => `${routes[EDITOR]}`,
    });
  }, [authenticatedDID, showLoginModal]);

  return (
    <Stack fullWidth={true}>
      <Helmet helmetData={helmetData}>
        <title>{worldConfig.title}</title>
      </Helmet>
      <Stack spacing="gap-y-2">
        <Stack customStyle="mb-2">
          <EditorPlaceholder
            profileId={authenticatedDID}
            avatar={authenticatedProfile?.avatar}
            actionLabel={t(`Start Beaming`)}
            placeholderLabel={t(`From Your Mind to the World 🧠 🌏 ✨`)}
            onClick={handleEditorPlaceholderClick}
            transformSource={transformSource}
          />
        </Stack>
        <BeamFeed
          scrollRestorationStorageKey={QueryKeys.GLOBAL_ANTENNA}
          estimatedHeight={150}
          itemSpacing={8}
          scrollOptions={{ overScan: 5 }}
          scrollTopIndicator={(listRect, onScrollToTop) => (
            <ScrollTopWrapper placement={listRect.left}>
              <ScrollTopButton hide={false} onClick={onScrollToTop} />
            </ScrollTopWrapper>
          )}
          trackEvent={analyticsActions.trackEvent}
        />
      </Stack>
    </Stack>
  );
};

export default GlobalAntennaPage;
