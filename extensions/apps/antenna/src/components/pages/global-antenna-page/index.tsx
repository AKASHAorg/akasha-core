import React, { useCallback } from 'react';
import EditorPlaceholder from '@akashaorg/design-system-components/lib/components/EditorPlaceholder';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import BeamFeed from '@akashaorg/ui-lib-feed/lib/components/beam-feed';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import {
  useAnalytics,
  useRootComponentProps,
  transformSource,
  useAkashaStore,
  hasOwn,
} from '@akashaorg/ui-awf-hooks';
import { Helmet, helmetData } from '@akashaorg/design-system-core/lib/utils';
import { ModalNavigationOptions, QueryKeys } from '@akashaorg/typings/lib/ui';
import { BeamContentResolver } from '@akashaorg/ui-lib-feed';

const GlobalAntennaPage: React.FC<unknown> = () => {
  const {
    data: { authenticatedProfile, authenticatedDID },
  } = useAkashaStore();
  const { navigateToModal, worldConfig } = useRootComponentProps();
  const { t } = useTranslation('app-antenna');
  const [analyticsActions] = useAnalytics();
  const _navigateToModal = React.useRef(navigateToModal);
  const navigate = useNavigate();

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
    navigate({ to: '/editor' });
  }, [authenticatedDID, navigate, showLoginModal]);

  return (
    <Stack fullWidth={true}>
      <Helmet helmetData={helmetData}>
        <title>{worldConfig.title}</title>
      </Helmet>
      <Stack spacing="gap-y-4">
        <EditorPlaceholder
          profileId={authenticatedDID}
          avatar={authenticatedProfile?.avatar}
          actionLabel={t(`Start Beaming`)}
          placeholderLabel={t(`From Your Mind to the World 🧠 🌏 ✨`)}
          onClick={handleEditorPlaceholderClick}
          transformSource={transformSource}
        />
        <BeamFeed
          scrollRestorationStorageKey={QueryKeys.GLOBAL_ANTENNA}
          estimatedHeight={150}
          itemSpacing={16}
          scrollOptions={{ overScan: 5 }}
          scrollTopIndicator={(listRect, onScrollToTop) => (
            <ScrollTopWrapper placement={listRect.left}>
              <ScrollTopButton hide={false} onClick={onScrollToTop} />
            </ScrollTopWrapper>
          )}
          trackEvent={analyticsActions.trackEvent}
          renderItem={itemData => {
            if (!hasOwn(itemData, 'content')) {
              /* Set the showNSFWCard prop to false so as to prevent the
               * NSFW beams from being displayed in the antenna feed when NSFW setting is off.
               **/
              return <BeamContentResolver beamId={itemData.beamID} showNSFWCard={false} />;
            }
          }}
        />
      </Stack>
    </Stack>
  );
};

export default GlobalAntennaPage;
