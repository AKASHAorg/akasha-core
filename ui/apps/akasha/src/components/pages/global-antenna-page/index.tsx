import React, { useCallback } from 'react';
import routes, { EDITOR } from '../../../routes';
import EditorPlaceholder from '@akashaorg/design-system-components/lib/components/EditorPlaceholder';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ScrollTopWrapper from '@akashaorg/design-system-core/lib/components/ScrollTopWrapper';
import ScrollTopButton from '@akashaorg/design-system-core/lib/components/ScrollTopButton';
import { useTranslation } from 'react-i18next';
import { useAnalytics, useRootComponentProps, transformSource } from '@akashaorg/ui-awf-hooks';
import { BeamFeed } from '@akashaorg/ui-lib-feed';
import { Helmet, helmetData } from '@akashaorg/design-system-core/lib/utils';
import { ModalNavigationOptions, Profile } from '@akashaorg/typings/lib/ui';

type GlobalAntennaPageProps = {
  authenticatedProfile: Profile;
};

const GlobalAntennaPage: React.FC<GlobalAntennaPageProps> = props => {
  const { authenticatedProfile } = props;
  const { getRoutingPlugin, navigateToModal } = useRootComponentProps();
  const { t } = useTranslation('app-akasha-integration');
  const [analyticsActions] = useAnalytics();
  const isLoggedIn = !!authenticatedProfile;
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
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
    if (!authenticatedProfile?.id) {
      //@TODO profile info hasn't been filled, show relevant message
      return;
    }
    navigateTo?.current({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: () => `${routes[EDITOR]}`,
    });
  }, [isLoggedIn, authenticatedProfile, showLoginModal]);

  const listHeader = React.useMemo(() => {
    return (
      <Stack customStyle="mb-2">
        <EditorPlaceholder
          profileId={authenticatedProfile?.did.id}
          avatar={authenticatedProfile?.avatar}
          actionLabel={t(`Start Beaming`)}
          placeholderLabel={t(`From Your Mind to the World 🧠 🌏 ✨`)}
          onClick={handleEditorPlaceholderClick}
          transformSource={transformSource}
        />
      </Stack>
    );
  }, [authenticatedProfile, t, handleEditorPlaceholderClick]);

  return (
    <Stack fullWidth={true}>
      <Helmet helmetData={helmetData}>
        <title>AKASHA World</title>
      </Helmet>
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

export default GlobalAntennaPage;
